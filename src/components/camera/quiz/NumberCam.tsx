"use client";

import api from "@/lib/axios";
import { useRef, useState, useEffect } from "react";

// ====== TYPES ======
interface SibiNumberQuizCameraProps {
  targetAnswer: string;
  onFinish: () => void;
  onWrong: () => void;
  questionText: string;
}

interface Landmark {
  x: number;
  y: number;
  z: number;
}

// MediaPipe global types
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

// ====== COMPONENT ======
export default function SibiNumberQuizCamera({
  targetAnswer,
  onFinish,
  onWrong,
  questionText,
}: SibiNumberQuizCameraProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastSentRef = useRef(0);
  const targetAnswerRef = useRef(targetAnswer);
  const isHandsLoaded = useRef(false);

  // Sync props
  useEffect(() => {
    targetAnswerRef.current = targetAnswer;
    setIsCorrect(false);
    setMessage("Tunjukkan jawabannya dengan bahasa isyarat");
  }, [targetAnswer]);

  // ======================
  // 1. LOAD MEDIAPIPE
  // ======================
  useEffect(() => {
    if (typeof window === "undefined" || isHandsLoaded.current) return;
    isHandsLoaded.current = true;

    let isMounted = true;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject());
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";

        script.onload = () => resolve();
        script.onerror = reject;

        document.head.appendChild(script);
      });

    const init = async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js"
        );

        let attempts = 0;
        while ((!window.Hands || !window.Camera) && attempts < 50) {
          await new Promise((r) => setTimeout(r, 100));
          attempts++;
        }

        if (!window.Hands || !window.Camera) {
          throw new Error("MediaPipe gagal dimuat");
        }

        if (!isMounted) return;

        const hands = new window.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
        });

        await hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        await hands.initialize();

        if (videoRef.current) {
          const cam = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 400,
            height: 300,
          });

          await cam.start();
          cameraRef.current = cam;
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        isHandsLoaded.current = false;
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      cameraRef.current?.stop();
      handsRef.current?.close();
      isHandsLoaded.current = false;
    };
  }, []);

  // ======================
  // 2. Extract Vector
  // ======================
  const extractHandVectorRel = (landmarks: Landmark[]): number[] => {
    const pts = landmarks.map((lm) => [lm.x, lm.y, lm.z]);
    const base = pts[0];
    const rel = pts.map((p) => [p[0] - base[0], p[1] - base[1], p[2] - base[2]]);

    const dThumb = [8, 12, 16, 20].map((i) =>
      Math.sqrt(
        (rel[4][0] - rel[i][0]) ** 2 +
          (rel[4][1] - rel[i][1]) ** 2 +
          (rel[4][2] - rel[i][2]) ** 2
      )
    );

    const fingerLen = [4, 8, 12, 16, 20].map((i) =>
      Math.sqrt(
        (rel[0][0] - rel[i][0]) ** 2 +
          (rel[0][1] - rel[i][1]) ** 2 +
          (rel[0][2] - rel[i][2]) ** 2
      )
    );

    return [...dThumb, ...fingerLen];
  };

  // ======================
  // 3. Process Hand
  // ======================
  const onResults = (results: any) => {
    if (
      !results.multiHandLandmarks ||
      isCorrect ||
      isProcessing ||
      !results.multiHandLandmarks[0]
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastSentRef.current < 1000) return;
    lastSentRef.current = now;

    const vector = extractHandVectorRel(results.multiHandLandmarks[0]);
    sendVectorToServer(vector);
  };

  // ======================
  // 4. Predict to Backend
  // ======================
  const sendVectorToServer = async (vector: number[]) => {
    if (isProcessing) return;

    try {
      console.log("Sending vector to API:", vector); // Log the vector being sent
      const res = await api.post(
        "https://signoria.gilanghuda.my.id/api/predict/number",
        { vector }
      );
      console.log("API response:", res); // Log the full response object
      const data = res.data;
      console.log("API response data:", data); // Log the parsed response data

      const predicted = data.label?.toString();
      const confidence = Math.floor(data.confidence * 100);

      console.log(`Predicted label: ${predicted}, Confidence: ${confidence}%`); // Log the prediction and confidence

      if (predicted === targetAnswerRef.current && confidence > 60) {
        setIsProcessing(true);
        setIsCorrect(true);
        setMessage(`✅ Benar! Jawabannya ${predicted}`);
        cleanupMediaPipe();
        onFinish();
      } else {
        onWrong();
      }

      // Log the top 3 predictions
      if (data.top_3) {
        console.log("Top 3 predictions:", data.top_3);
      }
    } catch (err) {
      console.error("Prediction error:", err); // Log any error during the request
      setError("Gagal mengirim data ke server.");
    }
  };

  // ======================
  // 5. Cleanup
  // ======================
  const cleanupMediaPipe = () => {
    cameraRef.current?.stop();
    handsRef.current?.close();

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // ======================
  // 6. UI
  // ======================
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white">
      <div className="rounded-lg bg-[#ADF5FF] p-6 mb-4">
        <h2 className="text-4xl text-[#022F40] font-bold text-center">
          {questionText}
        </h2>
      </div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={400}
          height={300}
          className="rounded-lg border border-gray-300 shadow-md"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
            <p className="text-white">Loading MediaPipe...</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-[#022F40] text-lg font-medium">{message}</p>}
    </div>
  );
}
