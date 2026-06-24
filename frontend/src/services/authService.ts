import api from "../api/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

// POST /api/auth/login
export const login = async (payload: LoginPayload): Promise<string> => {
  const response = await api.post("/auth/login", payload);
  return response.data.token as string;
};

// POST /api/auth/register
export const register = async (payload: RegisterPayload): Promise<void> => {
  await api.post("/auth/register", payload);
};

// GET /api/auth/me  (requires token in header via interceptor)
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  // The backend returns { message, user }
  return (response.data.user ?? response.data) as User;
};
