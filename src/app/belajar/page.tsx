"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAllQuizzes, fetchQuizDetail } from "@/services/quizservice";

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  time_limit: number;
  level: number;
  created_at: string;
}

export default function JourneyPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const hasFetched = useRef(false); // Prevent duplicate API calls

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    const fetchQuizzes = async () => {
      try {
        const data = await fetchAllQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Gagal memuat daftar kuis.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = async (quizId: string) => {
    router.push(`/belajar/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat daftar kuis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-poppins">
      <h1 className="text-3xl font-bold text-[#022F40] mb-6 text-center">
        Daftar Kuis
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
  {quizzes.map((quiz) => (
    <div
      key={quiz.id}
      className="bg-white border border-gray-200 rounded-lg shadow-md 
                 hover:bg-[#022F40] hover:text-white transition cursor-pointer 
                 aspect-square flex items-center justify-center text-center
                 p-4"
      onClick={() => handleQuizClick(quiz.id)}
    >
      <h2 className="text-lg font-bold">LEVEL {quiz.level}</h2>
    </div>
  ))}
</div>

    </div>
  );
}