"use client";
import api from "@/lib/axios";
import { useRef, useState, useEffect } from "react";

// ========== TYPES ==========
interface SibiSpellingQuizCameraProps {
  targetWord: string;
  onFinish: () => void;
  onWrong: () => void;
}

interface Landmark {
  x: number;
  y: number;
  z: number;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

// ========== COMPONENT ==========
export default function SibiSpellingQuizCamera({
  targetWord,
  onFinish,
  onWrong,
}: SibiSpellingQuizCameraProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<string[]>(
    Array(targetWord.length).fill("_")
  );
  const [message, setMessage] = useState(
    `Tunjukkan huruf: ${targetWord[0].toUpperCase()}`
  );
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastSentRef = useRef(0);
  const currentIndexRef = useRef(0);
  const isHandsLoaded = useRef(false);

  // ========= 1. LOAD MEDIAPIPE =========
  useEffect(() => {
    if (typeof window === "undefined" || isHandsLoaded.current) return;
    isHandsLoaded.current = true;

    let isMounted = true;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`) as
          | HTMLScriptElement
          | null;

        if (existing) {
          if (existing.getAttribute("data-loaded") === "true") {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject());
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

        if (!isMounted) return;
        if (!window.Hands || !window.Camera) {
          throw new Error("MediaPipe tidak dapat dimuat");
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
        handsRef.current = hands;

        await hands.initialize();

        if (videoRef.current) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (!isMounted || !handsRef.current) return;

              if (
                videoRef.current &&
                videoRef.current.readyState === 4
              ) {
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

        if (isMounted) setIsLoading(false);
      } catch (err: any) {
        if (isMounted) {
          setError(`Gagal memuat MediaPipe: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;

      cameraRef.current?.stop();
      cameraRef.current = null;

      handsRef.current?.close();
      handsRef.current = null;

      isHandsLoaded.current = false;
    };
  }, []);

  // ========= 2. ADVANCED FEATURE EXTRACTION ========
  const extractHandVectorAdvanced = (landmarks: Landmark[]): number[] => {
    const pts = landmarks.map((lm) => [lm.x, lm.y, lm.z]);
    const base = pts[0];
    const rel = pts.map((p) => [
      p[0] - base[0],
      p[1] - base[1],
      p[2] - base[2],
    ]);

    const palmSize =
      Math.sqrt(
        (rel[0][0] - rel[9][0]) ** 2 +
          (rel[0][1] - rel[9][1]) ** 2 +
          (rel[0][2] - rel[9][2]) ** 2
      ) + 1e-6;

    const dist = (a: number[], b: number[]) =>
      Math.sqrt(
        (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
      );

    const dThumb = [8, 12, 16, 20].map((i) =>
      dist(rel[4], rel[i]) / palmSize
    );

    const fingerLen = [4, 8, 12, 16, 20].map((i) =>
      dist(rel[0], rel[i]) / palmSize
    );

    const angle = (a: number[], b: number[], c: number[]) => {
      const ba = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];

      const dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
      const mag1 = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2);
      const mag2 = Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);

      return Math.acos(dot / (mag1 * mag2 + 1e-6));
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

  // ========= 3. MEDIAPIPE CALLBACK =========
  const onResults = (results: any) => {
    if (
      !results.multiHandLandmarks ||
      !results.multiHandLandmarks[0] ||
      isFinished ||
      isProcessing
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastSentRef.current < 1000) return;
    lastSentRef.current = now;

    const landmarks = results.multiHandLandmarks[0] as Landmark[];
    const vector = extractHandVectorAdvanced(landmarks);
    sendVectorToServer(vector);
  };

  // ========= 4. SEND VECTOR TO BACKEND =========
  const sendVectorToServer = async (vector: number[]) => {
    if (isProcessing) return;

    try {
      const res = await api.post("/predict/alphabet", { vector });
      const data = res.data;

      const predicted: string = data.label?.toUpperCase() ?? "_";
      const confidence: number = data.confidence ?? 0;

      const idx = currentIndexRef.current;
      const targetLetter = targetWord[idx].toUpperCase();

      if (predicted === targetLetter && confidence > 0.6) {
        setIsProcessing(true);

        setProgress((prev) => {
          const updated = [...prev];
          updated[idx] = predicted;
          return updated;
        });

        const nextIndex = idx + 1;

        if (nextIndex < targetWord.length) {
          currentIndexRef.current = nextIndex;
          setCurrentIndex(nextIndex);
          setMessage(
            `Tunjukkan huruf: ${targetWord[nextIndex].toUpperCase()}`
          );
          setIsProcessing(false);
        } else {
          setIsFinished(true);
          setMessage(`🎉 Kata lengkap: ${targetWord}`);
          cleanupMediaPipe();
          onFinish();
        }
      } else {
        setMessage(`Tunjukkan huruf: ${targetLetter}`);
        onWrong();
      }
    } catch {
      setError("Gagal mengirim data ke server.");
    }
  };

  // ========= 5. CLEANUP =========
  const cleanupMediaPipe = () => {
    try {
      cameraRef.current?.stop();
      cameraRef.current = null;

      handsRef.current?.close();
      handsRef.current = null;

      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    } catch {}
  };

  // ========= 6. UI =========
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-black">SIBI Quiz - Tebak Kata</h1>
      <h2 className="text-xl text-black font-semibold">
        Kata Target: {targetWord}
      </h2>

      <div className="flex space-x-2 text-3xl font-bold">
        {progress.map((ch, i) => (
          <span
            key={i}
            className={`px-2 py-1 border-b-2 ${
              i === currentIndex ? "border-blue-500" : "border-gray-300"
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
          className="rounded-lg border shadow-md"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
            Loading MediaPipe...
          </div>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}
      <p className="text-lg">{message}</p>

      {isFinished && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            currentIndexRef.current = 0;
            setCurrentIndex(0);
            setProgress(Array(targetWord.length).fill("_"));
            setIsFinished(false);
            setIsProcessing(false);
            setMessage(
              `Tunjukkan huruf: ${targetWord[0].toUpperCase()}`
            );
          }}
        >
          Ulangi Kuis 🔁
        </button>
      )}
    </div>
  );
}
