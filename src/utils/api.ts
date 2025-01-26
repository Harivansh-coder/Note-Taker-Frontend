import axios from "axios";
import { AuthResponse, Note } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: async (data: {
    name: string;
    email: string;
    dateOfBirth: string;
    otp: number;
  }) => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },
  signin: async (data: { email: string; otp: number }) => {
    const response = await api.post<AuthResponse>("/auth/signin", data);
    return response.data;
  },
  getOtp: async (data: { email: string }) => {
    const response = await api.post("/auth/otp", data);
    return response.data.otp;
  },
};

export const notesApi = {
  getNotes: async () => {
    // response is and json object with a data property that is an array of Note objects
    const response = await api.get<{ notes: Note[] }>("/notes");
    return response.data.notes;
  },
  createNote: async (content: string) => {
    const response = await api.post<Note>("/notes", { content });
    return response.data;
  },
  updateNote: async (id: string, content: string) => {
    const response = await api.put<Note>(`/notes/${id}`, { content });
    return response.data;
  },
  deleteNote: async (id: string) => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;
