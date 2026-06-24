import api from "../api/axios";

export interface Topic {
  id: number;
  topicName: string;
  description?: string;
}

export type TopicPayload = Omit<Topic, "id">;

// GET /api/topics
export const getAllTopics = async (): Promise<Topic[]> => {
  const response = await api.get("/topics");
  return response.data as Topic[];
};

// GET /api/topics/:id
export const getTopicById = async (id: number): Promise<Topic> => {
  const response = await api.get(`/topics/${id}`);
  return response.data as Topic;
};

// POST /api/topics
export const createTopic = async (payload: TopicPayload): Promise<Topic> => {
  const response = await api.post("/topics", payload);
  return response.data as Topic;
};

// PUT /api/topics/:id
export const updateTopic = async (
  id: number,
  payload: Partial<TopicPayload>
): Promise<Topic> => {
  const response = await api.put(`/topics/${id}`, payload);
  return response.data as Topic;
};

// DELETE /api/topics/:id
export const deleteTopic = async (id: number): Promise<void> => {
  await api.delete(`/topics/${id}`);
};
