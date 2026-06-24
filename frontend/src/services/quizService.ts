import api from "../api/axios";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSubmitPayload {
  topicId: number;
  answers: { questionId: number; answer: string }[];
}

export interface QuizResult {
  score: number;
  total: number;
  details: { questionId: number; correct: boolean }[];
}

// GET /api/quizzes/:topicId
export const getQuizByTopic = async (
  topicId: number
): Promise<QuizQuestion[]> => {
  const response = await api.get(`/quizzes/${topicId}`);
  return response.data as QuizQuestion[];
};

// POST /api/quizzes/submit
export const submitQuiz = async (
  payload: QuizSubmitPayload
): Promise<QuizResult> => {
  const response = await api.post("/quizzes/submit", payload);
  return response.data as QuizResult;
};
