// src/components/camera/SibiNumberPlayground.tsx
"use client";


import api from "@/lib/axios";
import { loadMediaPipe } from "@/lib/mediapipe";
import { useRef, useState, useEffect } from "react";

// ==== TYPE DEFINITIONS ====
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

/** Tipe landmark Mediapipe */
interface Landmark {
  x: number;
  y: number;
  z: number;
}

/** Tipe hasil dari Mediapipe */
interface HandsResult {
  multiHandLandmarks?: Landmark[][];
}

// ==== FEATURE EXTRACTION ====

const extractHandVectorRel = (landmarks: Landmark[]): number[] => {
  const pts = landmarks.map((lm) => [lm.x, lm.y, lm.z]);
  const base = pts[0];
  const rel = pts.map((p) => [p[0] - base[0], p[1] - base[1], p[2] - base[2]]);

  const dThumb = [8, 12, 16, 20].map((i) => {
    return Math.sqrt(
      Math.pow(rel[4][0] - rel[i][0], 2) +
        Math.pow(rel[4][1] - rel[i][1], 2) +
        Math.pow(rel[4][2] - rel[i][2], 2)
    );
  });

  const fingerLen = [4, 8, 12, 16, 20].map((i) => {
    return Math.sqrt(
      Math.pow(rel[0][0] - rel[i][0], 2) +
        Math.pow(rel[0][1] - rel[i][1], 2) +
        Math.pow(rel[0][2] - rel[i][2], 2)
    );
  });

  return [...dThumb, ...fingerLen];
};

export default function SibiNumberPlayground() {
  const [predictedLabel, setPredictedLabel] = useState<string>("---");
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState<boolean>(false); // Track MediaPipe readiness

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastSentRef = useRef<number>(0);
  const isHandsLoaded = useRef<boolean>(false);

  const predictionEndpoint = "https://signoria.gilanghuda.my.id/api/predict/number";

  // ===== SEND VECTOR TO SERVER =====
  const sendVectorToServer = async (vector: number[]) => {
    try {
      console.log("Sending vector to API:", vector); // Log the vector being sent
      const res = await api.post(predictionEndpoint, { vector });
      console.log("API response:", res); // Log the full response object
      const data = res.data;
      console.log("API response data:", data); // Log the parsed response data

      if (data.error) {
        console.error("Server error:", data.error);
        setError(data.error);
        return;
      }

      const predicted = data.label?.toString() ?? "---";
      const conf = Math.floor(data.confidence * 100);

      console.log(`Predicted label: ${predicted}, Confidence: ${conf}%`); // Log the prediction and confidence

      if (conf >= 50) {
        setPredictedLabel(predicted);
        setConfidence(conf);
      } else {
        setPredictedLabel("---");
        setConfidence(0);
      }

      // Log the top 3 predictions
      if (data.top_3) {
        console.log("Top 3 predictions:", data.top_3);
      }
    } catch (err) {
      console.error("Prediction error:", err); // Log any error during the request
      setError("Gagal mengirim data ke server. Pastikan backend berjalan.");
    }
  };

  // ===== ON RESULT FROM MEDIAPIPE =====
  const onResults = (results: HandsResult) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setPredictedLabel("---");
      setConfidence(0);
      return;
    }

    const now = Date.now();
    if (now - lastSentRef.current < 400) return;
    lastSentRef.current = now;

    const landmarks = results.multiHandLandmarks[0];
    if (!Array.isArray(landmarks) || landmarks.length === 0) return;

    const vector = extractHandVectorRel(landmarks);
    sendVectorToServer(vector);
  };

  // ===== MEDIAPIPE INITIALIZATION =====
  useEffect(() => {
    if (typeof window === "undefined" || isHandsLoaded.current) return;
    isHandsLoaded.current = true;

    let isMounted = true;

    setPredictedLabel("---");
    setConfidence(0);
    setError(null);
    setIsLoading(true);

    const init = async () => {
      try {
        await loadMediaPipe();

        if (isMounted) {
          setIsMediaPipeReady(true); // Set MediaPipe as ready
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Gagal memuat MediaPipe. Coba refresh halaman.");
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
      cameraRef.current?.stop();
      handsRef.current?.close();

      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      isHandsLoaded.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMediaPipeReady) return;

    const initHands = async () => {
      try {
        const Hands = window.Hands;
        const Camera = window.Camera;

        if (!Hands || !Camera) {
          throw new Error("MediaPipe Hands or Camera is not available.");
        }

        const hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        await hands.initialize();

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current?.readyState === 4) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          cameraRef.current = camera;
        }
      } catch (err) {
        setError(err.message || "Gagal menginisialisasi MediaPipe Hands.");
      }
    };

    initHands();
  }, [isMediaPipeReady]);

  // ==== UI ====
  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {isLoading && !isMediaPipeReady ? ( // Show loading state until MediaPipe is ready
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-gray-500">Memuat MediaPipe...</p>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-lg shadow-xl rounded-xl overflow-hidden border-4 border-gray-200">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width={640}
              height={480}
              className="w-full h-auto object-cover"
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                <p className="text-white text-lg">Memuat model Angka...</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-800/80">
                <p className="text-white text-lg">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-[#022F40] text-white p-4 rounded-xl shadow-lg w-full max-w-lg text-center">
            <p className="text-4xl font-extrabold mb-1">{predictedLabel}</p>
            <p className="text-sm font-semibold">
              {confidence > 0 ? `Keyakinan: ${confidence}%` : "Menunggu Isyarat..."}
            </p>
          </div>

          <div className="text-sm text-gray-500 mt-4 text-center">
            <p>Mode Deteksi: ANGKA (0-9).</p>
            <p>Prediksi diperbarui setiap 0.4 detik.</p>
          </div>
        </>
      )}
    </div>
  );
}
