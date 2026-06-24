import api from "../api/axios";

export interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  exampleSentence?: string;
  pronunciation?: string;
  topicId?: number;
}

export type VocabularyPayload = Omit<Vocabulary, "id">;

// GET /api/vocabularies
export const getAllVocabulary = async (): Promise<Vocabulary[]> => {
  const response = await api.get("/vocabularies");
  return response.data as Vocabulary[];
};

// GET /api/vocabularies/:id
export const getVocabularyById = async (id: number): Promise<Vocabulary> => {
  const response = await api.get(`/vocabularies/${id}`);
  return response.data as Vocabulary;
};

// POST /api/vocabularies
export const createVocabulary = async (
  payload: VocabularyPayload
): Promise<Vocabulary> => {
  const response = await api.post("/vocabularies", payload);
  return response.data as Vocabulary;
};

// PUT /api/vocabularies/:id
export const updateVocabulary = async (
  id: number,
  payload: Partial<VocabularyPayload>
): Promise<Vocabulary> => {
  const response = await api.put(`/vocabularies/${id}`, payload);
  return response.data as Vocabulary;
};

// DELETE /api/vocabularies/:id
export const deleteVocabulary = async (id: number): Promise<void> => {
  await api.delete(`/vocabularies/${id}`);
};
