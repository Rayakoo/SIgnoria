"use client";

import { useEffect, useState } from "react";
import { fetchQuizDetail, submitQuizAnswer, submitQuiz, submitCameraQuizAnswer, getAttemptProgress } from "@/services/quizservice";
import dynamic from "next/dynamic";
import { get } from "http";

// Define prop types for the dynamically imported components
interface AlphabetPlaygroundProps {
  targetWord: string;
  onFinish: () => Promise<void>;
  onWrong: () => void;
}

interface NumberPlaygroundProps {
  targetAnswer: string;
  onFinish: () => Promise<void>;
  onWrong: () => void;
}

// Lazy load camera components with proper typing
const DynamicAlphabetPlayground = dynamic<AlphabetPlaygroundProps>(
  () => import("@/components/camera/sandbox/AlphabetCam"),
  { ssr: false, loading: () => <CameraLoader message="Memuat model Huruf..." /> }
);

const DynamicNumberPlayground = dynamic<NumberPlaygroundProps>(
  () => import("@/components/camera/sandbox/NumberCam"),
  { ssr: false, loading: () => <CameraLoader message="Memuat model Angka..." /> }
);

function CameraLoader({ message }: { message: string }) {
  return (
    <div className="min-h-[480px] w-full grid place-items-center bg-gray-100 rounded-xl border">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

interface QuizDetailClientProps {
  id: string;
  attemptId: string;
}

export default function QuizDetailClient({ id, attemptId }: QuizDetailClientProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize at 0;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false); // Track if an answer is being submitted
  const [cameraMode, setCameraMode] = useState<"alphabet" | "number">("alphabet"); // Track camera mode

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizDetail(id);
        const progress = await getAttemptProgress(id, attemptId);
        setQuiz(data);
        setCurrentIndex(progress.answered_questions); // Start from the correct question
      } catch (err) {
        setError("Gagal memuat data quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!selectedOption || isAnswering) {
      setError("Harap pilih jawaban sebelum melanjutkan.");
      return;
    }

    setIsAnswering(true); // Prevent multiple submissions
    const currentQuestion = quiz.questions[currentIndex];
    const payload = {
      question_id: currentQuestion.id,
      selected_option_id: selectedOption,
    };

    try {
      await submitQuizAnswer(id, attemptId, payload);
      setSelectedOption(null);
      setError("");

      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        console.log("All questions answered. Ready to submit the quiz.");
      }
    } catch (err) {
      setError("Gagal mengirim jawaban.");
    } finally {
      setIsAnswering(false); // Re-enable submission
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedOption || isAnswering) {
      setError("Harap pilih jawaban sebelum mengumpulkan kuis.");
      return;
    }

    setSubmitting(true);
    setIsAnswering(true); // Prevent multiple submissions
    try {
      const currentQuestion = quiz.questions[currentIndex];
      const payload = {
        question_id: currentQuestion.id,
        selected_option_id: selectedOption,
      };

      await submitQuizAnswer(id, attemptId, payload);
      await submitQuiz(id, attemptId);
      alert("Quiz berhasil dikumpulkan!");
      window.location.href = "/belajar"; // Redirect to /belajar
    } catch (err) {
      setError("Gagal mengumpulkan kuis.");
    } finally {
      setSubmitting(false);
      setIsAnswering(false); // Re-enable submission
    }
  };

  const handleCameraPrediction = async (predicted: string) => {
    const currentQuestion = quiz.questions[currentIndex];
    const correctAnswer = currentQuestion.content.toUpperCase();

    if (predicted === correctAnswer) {
      try {
        await submitCameraQuizAnswer(id, attemptId, {
          question_id: currentQuestion.id,
          is_correct: true,
        });
        alert("Anda benar!");
        if (currentIndex < quiz.questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          await handleSubmitQuiz();
        }
      } catch (err) {
        setError("Gagal mengirim jawaban kamera.");
      }
    } else {
      alert("Masih salah, coba lagi.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!quiz) return <p className="p-4">Quiz tidak ditemukan</p>;

  const questions = quiz.questions ?? [];
  const current = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (!current) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Soal tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      <div className="border rounded-lg p-4 shadow-sm">
        <p className="font-semibold mb-3">
          Soal {currentIndex + 1} / {questions.length}
        </p>

        {/* Render question based on category */}
        {current.question_category === "image_alphabet" ? (
          <div>
            <img
              src={current.question_text}
              alt="Soal"
              className="w-40 h-40 object-contain mb-4"
            />
            <div className="space-y-2">
              {current.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedOption === opt.id ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {opt.content}
                </button>
              ))}
            </div>
          </div>
        ) : current.question_category === "image_options" ? (
          <div>
            <p className="text-lg mb-4">{current.question_text}</p>
            <div className="space-y-2">
              {current.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedOption === opt.id ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  <img
                    src={opt.content}
                    alt="Jawaban"
                    className="w-20 h-20 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : current.question_category === "camera_based" ? (
          <div>
            <p className="text-lg mb-4">{current.question_text}</p>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${
                  cameraMode === "alphabet"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setCameraMode("alphabet")}
              >
                Alphabet Cam
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${
                  cameraMode === "number"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setCameraMode("number")}
              >
                Number Cam
              </button>
            </div>

            {/* Render Camera Based on Selected Mode */}
            {cameraMode === "alphabet" ? (
              <DynamicAlphabetPlayground
                targetWord={current.content}
                onFinish={() => handleCameraPrediction(current.content)}
                onWrong={() => alert("Masih salah, coba lagi.")}
              />
            ) : (
              <DynamicNumberPlayground
                targetAnswer={current.content}
                onFinish={() => handleCameraPrediction(current.content)}
                onWrong={() => alert("Masih salah, coba lagi.")}
              />
            )}
          </div>
        ) : null}

        <button
          onClick={isLastQuestion ? handleSubmitQuiz : handleSubmitAnswer}
          disabled={(!selectedOption && current.question_category !== "camera_based") || isAnswering}
          className={`mt-4 w-full p-3 rounded-lg font-semibold transition ${
            submitting || isAnswering
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isLastQuestion
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {submitting
            ? "Mengumpulkan..."
            : isAnswering
            ? "Mengirim..."
            : isLastQuestion
            ? "Kumpulkan"
            : "Selanjutnya"}
        </button>
      </div>
    </div>
  );
}
