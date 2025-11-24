import api from "@/lib/axios";

// Get all quizzes with pagination
export async function fetchAllQuizzes(skip: number = 0, limit: number = 10) {
  try {
    const res = await api.get(`/quizzes?skip=${skip}&limit=${limit}`);
    if (!res.data || res.data.status !== "success") {
      throw new Error("Gagal memuat daftar kuis");
    }
    return res.data.data; // Return the quizzes data
  } catch (err) {
    console.error("Failed to fetch quizzes:", err);
    throw err;
  }
}

// Quiz detail cache helpers
function saveQuizDetailCache(quizId: string, data: any) {
  console.log("SAVE CACHE RUNNING IN:", typeof window); // Debug log
  if (typeof window !== "undefined") {
    console.log("Saving cache for quizId:", quizId, "with data:", data); // Log cache data
    localStorage.setItem(`quiz_detail_${quizId}`, JSON.stringify(data));
  }
}

function getQuizDetailCache(quizId: string) {
  console.log("READ CACHE RUNNING IN:", typeof window); // Debug log
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(`quiz_detail_${quizId}`);
    const cache = raw ? JSON.parse(raw) : null;
    console.log("Cache for quizId:", quizId, "is:", cache); // Log cache contents
    return cache;
  }
  return null;
}

// Track last answered question
function saveLastQuestion(quizId: string, questionId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`quiz_last_question_${quizId}`, questionId);
  }
}

function getLastQuestion(quizId: string) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(`quiz_last_question_${quizId}`) || null;
  }
  return null;
}

function clearQuizCaches(quizId: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`quiz_detail_${quizId}`);
    localStorage.removeItem(`quiz_last_question_${quizId}`);
  }
}

// Get quiz detail (with cache)
export async function fetchQuizDetail(quizId: string) {
  if (!quizId) {
    throw new Error("ID kuis tidak valid.");
  }

  try {
    const cache = getQuizDetailCache(quizId);
    console.log("Cache for quiz detail:", cache); // Log cache
    if (cache) return cache;

    const res = await api.get(`/quizzes/${quizId}`);
    console.log("Response from fetchQuizDetail:", res.data); // Log response
    if (!res.data || res.data.status !== "success") {
      throw new Error("Gagal memuat detail kuis");
    }

    saveQuizDetailCache(quizId, res.data.data);
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch quiz detail:", err);
    throw err;
  }
}

// Start quiz attempt
export async function startQuizAttempt(quizId: string) {
  try {
    const res = await api.post(`/quizzes/${quizId}/attempts`);
    console.log("Response from startQuizAttempt:", res.data); // Log response
    if (!res.data || res.data.status !== "success") {
      throw new Error("Gagal memulai attempt kuis");
    }

    return res.data.data;
  } catch (err) {
    console.error("Failed to start quiz attempt:", err);
    throw err;
  }
}

// Submit quiz
export async function submitQuiz(quizId: string, attemptId: string) {
  try {
    const res = await api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`);
    console.log("Response from submitQuiz:", res.data); // Log response
    if (!res.data || res.data.status !== "success") {
      throw new Error("Gagal submit kuis");
    }

    return res.data.data;
  } catch (err) {
    console.error("Failed to submit quiz:", err);
    throw err;
  }
}

// Answer normal quiz
export async function submitQuizAnswer(
  quizId: string,
  attemptId: string,
  payload: {
    question_id: string;
    selected_option_id: string;
  }
) {
  try {
    console.log("Payload for submitQuizAnswer:", payload); // Log payload
    const res = await api.post(
      `/quizzes/${quizId}/attempts/${attemptId}/answers`,
      payload
    );
    console.log("Response from submitQuizAnswer:", res.data); // Log response
    if (!res.data || res.data.status !== "success") {
      throw new Error("Gagal mengirim jawaban kuis");
    }

    return res.data.data;
  } catch (err) {
    console.error("Failed to submit quiz answer:", err);
    throw err;
  }
}

// Answer camera-based quiz
export async function submitCameraQuizAnswer(
  quizId: string,
  attemptId: string,
  payload: {
    is_correct: boolean;
    question_id: string;
  }
) {
  try {
    const res = await api.post(
      `/quizzes/${quizId}/attempts/${attemptId}/camera-answers`,
      payload
    );
    if (!res.data || !res.data.success) {
      throw new Error("Gagal mengirim jawaban kamera");
    }

    return res.data.data;
  } catch (err) {
    console.error("Failed to submit camera answer:", err);
    throw err;
  }
}

// Get quiz result
export async function fetchQuizResult(quizId: string, attemptId: string) {
  try {
    const res = await api.get(
      `/api/quizzes/${quizId}/attempts/${attemptId}/result`
    );
    if (!res.data || !res.data.success) {
      throw new Error("Gagal memuat hasil kuis");
    }
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch quiz result:", err);
    throw err;
  }
}

// Get attempt progress
export async function getAttemptProgress(quizId: string, attemptId: string) {
  try {
    const response = await fetch(`https://signoria.gilanghuda.my.id/api/quizzes/${quizId}/attempts/${attemptId}/progress`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal memuat progress attempt kuis");
    }

    const data = await response.json();
    console.log("Response from getAttemptProgress:", data); // Log response

    if (!data || data.status !== "success") {
      throw new Error("Gagal memuat progress attempt kuis");
    }

    return data.data;
  } catch (err) {
    console.error("Failed to fetch attempt progress:", err);
    throw err;
  }
}
