"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchQuizDetail,
  startQuizAttempt,
  getAttemptProgress,
} from "@/services/quizservice";

interface QuizDetail {
  title: string;
  level: number;
  total_questions: number;
}

interface AttemptProgress {
  attempt_id: string;
  quiz_id: string;
  user_id: string;
  total_questions: number;
  answered_questions: number;
  remaining_questions: number;
  progress_percentage: number;
  is_completed: boolean;
  answered_details: Array<{
    answer_id: string;
    question_id: string;
    question_text: string;
    question_category: string;
    selected_option_id: string;
    selected_option_content: string;
    is_correct: boolean;
    answered_at: string;
  }>;
}

export default function QuizCoverClient({ id }: { id: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [progress, setProgress] = useState<AttemptProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const quizData = await fetchQuizDetail(id);
        setQuiz(quizData);

        // Try to fetch attempt progress
        const attemptId = localStorage.getItem(`quiz_attempt_${id}`);
        if (attemptId) {
          const progressData = await getAttemptProgress(id, attemptId);
          setProgress(progressData);
        }
      } catch (err) {
        console.error("Failed to load quiz data or progress:", err);
        setError("Gagal memuat data kuis.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [id]);

  const handleStartQuiz = async () => {
    try {
      const attemptResponse = await startQuizAttempt(id);
      const attemptId = attemptResponse.attempt_id;

      // Save the attempt ID to localStorage
      localStorage.setItem(`quiz_attempt_${id}`, attemptId);

      router.push(`/belajar/quiz/${id}/${attemptId}`);
    } catch (err) {
      console.error("Failed to start quiz attempt:", err);
      setError("Gagal memulai kuis.");
    }
  };

  const handleResumeQuiz = () => {
    if (progress) {
      router.push(`/belajar/quiz/${id}/${progress.attempt_id}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 font-semibold text-lg">
        Memuat detail kuis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold text-lg">
        {error}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 text-gray-500 font-semibold text-lg">
        Quiz tidak ditemukan.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <h2 className="font-bold text-xl text-gray-900">{quiz.title}</h2>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
          Level {quiz.level}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Jumlah Pertanyaan</div>
          <div className="font-bold text-lg text-[#2563eb]">
            {quiz.total_questions} Soal
          </div>
        </div>
        {progress && (
          <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">Sudah Dijawab</div>
            <div className="font-bold text-lg text-[#2563eb]">
              {progress.answered_questions} Soal
            </div>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      {progress && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress.progress_percentage}%` }}
          ></div>
        </div>
      )}
      <div className="flex gap-3">
        {progress ? (
          <button
            className="bg-[#2563eb] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#174bbd] transition flex-1"
            onClick={handleResumeQuiz}
          >
            Lanjutkan Quiz
          </button>
        ) : (
          <button
            className="bg-[#2563eb] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#174bbd] transition flex-1"
            onClick={handleStartQuiz}
          >
            Mulai Quiz
          </button>
        )}
        <button
          className="bg-gray-100 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow flex-1"
          onClick={() => router.back()}
        >
          &larr; Kembali
        </button>
      </div>
    </section>
  );
}
