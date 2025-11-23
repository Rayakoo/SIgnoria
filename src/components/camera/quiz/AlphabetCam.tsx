"use client";

import api from "@/lib/axios";
import { useRef, useState, useEffect } from "react";

// =============== PROPS TYPE =============================
interface SibiAlphabetQuizCameraProps {
  targetWord: string;
  onFinish: () => void;
  onWrong: () => void;
}

// =======================================================
export default function SibiAlphabetQuizCamera({
  targetWord,
  onFinish,
  onWrong,
}: SibiAlphabetQuizCameraProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<string[]>(
    Array(targetWord.length).fill("_")
  );
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastSentRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);
  const isHandsLoaded = useRef<boolean>(false);

  // =============== LOAD SCRIPT ==========================
  const loadScript = (src: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${src}"]`
      ) as HTMLScriptElement | null;

      if (existingScript) {
        if (existingScript.getAttribute("data-loaded") === "true") {
          resolve();
          return;
        }
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        script.setAttribute("data-loaded", "true");
        resolve();
      };
      script.onerror = (err) => reject(err);

      document.head.appendChild(script);
    });
  };

  // =============== INIT MEDIAPIPE =======================
  useEffect(() => {
    if (typeof window === "undefined" || isHandsLoaded.current) return;
    isHandsLoaded.current = true;

    let isMounted = true;

    const init = async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js"
        );

        // Wait MediaPipe globals
        let attempts = 0;
        while ((!window.Hands || !window.Camera) && attempts < 50) {
          await new Promise((r) => setTimeout(r, 100));
          attempts++;
        }

        if (!window.Hands || !window.Camera) {
          throw new Error("MediaPipe gagal dimuat");
        }

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
        if (!isMounted) return;

        await hands.initialize();
        handsRef.current = hands;

        // Start Camera
        if (videoRef.current) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (!handsRef.current) return;
              if (videoRef.current?.readyState === 4) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 400,
            height: 300,
          });

          await camera.start();
          if (!isMounted) {
            camera.stop();
            return;
          }
          cameraRef.current = camera;
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Gagal memuat MediaPipe");
        isHandsLoaded.current = false;
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;

      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  // =============== FEATURE EXTRACTION ====================
  const extractHandVectorAdvanced = (landmarks: any[]): number[] => {
    const pts = landmarks.map((lm) => [lm.x, lm.y, lm.z]);
    const base = pts[0];
    const rel = pts.map((p) => [p[0] - base[0], p[1] - base[1], p[2] - base[2]]);

    const palmSize =
      Math.sqrt(
        (rel[0][0] - rel[9][0]) ** 2 +
          (rel[0][1] - rel[9][1]) ** 2 +
          (rel[0][2] - rel[9][2]) ** 2
      ) + 1e-6;

    const dThumb = [8, 12, 16, 20].map((i) => {
      const dist = Math.sqrt(
        (rel[4][0] - rel[i][0]) ** 2 +
          (rel[4][1] - rel[i][1]) ** 2 +
          (rel[4][2] - rel[i][2]) ** 2
      );
      return dist / palmSize;
    });

    const fingerLen = [4, 8, 12, 16, 20].map((i) => {
      const dist = Math.sqrt(
        (rel[0][0] - rel[i][0]) ** 2 +
          (rel[0][1] - rel[i][1]) ** 2 +
          (rel[0][2] - rel[i][2]) ** 2
      );
      return dist / palmSize;
    });

    const angle = (a: number[], b: number[], c: number[]) => {
      const ba = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
      const dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
      const magBa = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2);
      const magBc = Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);
      return Math.acos(dot / (magBa * magBc + 1e-6));
    };

    const angs = [
      angle(rel[2], rel[3], rel[4]),
      angle(rel[5], rel[6], rel[8]),
      angle(rel[9], rel[10], rel[12]),
      angle(rel[13], rel[14], rel[16]),
      angle(rel[17], rel[18], rel[20]),
    ];

    return [...dThumb, ...fingerLen, ...angs];
  };

  // =============== ONRESULTS =============================
  const onResults = (results: any) => {
    if (
      !results.multiHandLandmarks ||
      results.multiHandLandmarks.length === 0 ||
      isFinished ||
      isProcessing
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastSentRef.current < 1000) return;
    lastSentRef.current = now;

    const landmarks = results.multiHandLandmarks[0];
    const vector = extractHandVectorAdvanced(landmarks);
    sendVectorToServer(vector);
  };

  // =============== SEND TO FASTAPI =======================
  const sendVectorToServer = async (vector: number[]) => {
    if (isProcessing) return;

    try {
      console.log("Sending vector to API:", vector); // Log the vector being sent
      const res = await api.post("https://signoria.gilanghuda.my.id/api/predict/alphabet", { vector });
      console.log("API response:", res); // Log the full response object
      const data = res.data;
      console.log("API response data:", data); // Log the parsed response data

      const predicted = data.label?.toString()?.toUpperCase() ?? "_";
      const confidence = Math.floor(data.confidence * 100);

      console.log(`Predicted label: ${predicted}, Confidence: ${confidence}%`); // Log the prediction and confidence

      const currentIdx = currentIndexRef.current;
      const targetLetter = targetWord[currentIdx];

      if (predicted === targetLetter && confidence > 60) {
        setIsProcessing(true);

        setProgress((prev) => {
          const updated = [...prev];
          updated[currentIdx] = predicted;
          return updated;
        });

        const nextIndex = currentIdx + 1;

        if (nextIndex < targetWord.length) {
          currentIndexRef.current = nextIndex;
          setCurrentIndex(nextIndex);
          setIsProcessing(false);
        } else {
          setIsFinished(true);
          onFinish();
        }
      } else {
        onWrong();
      }

      // Log the top 3 predictions
      if (data.top_3) {
        console.log("Top 3 predictions:", data.top_3);
      }
    } catch (err) {
      console.error("Prediction error:", err); // Log any error during the request
      setError("Gagal mengirim data ke server");
    }
  };

  // =============== UI ================================
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#022F40] mb-4">
        SIBI Quiz - Tebak Kata
      </h1>

      <h2 className="text-xl text-[#022F40] font-semibold mb-4">
        Kata Target: {targetWord}
      </h2>

      <div className="flex space-x-2 text-3xl font-bold text-[#022F40]">
        {progress.map((ch, i) => (
          <span
            key={i}
            className={`px-2 py-1 border-b-2 ${
              i === currentIndex ? "border-[#ADF5FF]" : "border-gray-300"
            }`}
          >
            {ch}
          </span>
        ))}
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
            <p className="text-white text-lg">Loading MediaPipe...</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {message && (
        <p className="text-[#022F40] text-lg font-medium">{message}</p>
      )}

      {isFinished && (
        <button
          onClick={() => {
            currentIndexRef.current = 0;
            setCurrentIndex(0);
            setProgress(Array(targetWord.length).fill("_"));
            setIsFinished(false);
            setIsProcessing(false);
            setMessage(`Tunjukkan huruf: ${targetWord[0]}`);
          }}
          className="mt-4 px-4 py-2 bg-[#022F40] text-white rounded-md hover:bg-[#1b4a5a]"
        >
          Ulangi Kuis 🔁
        </button>
      )}
    </div>
  );
}
