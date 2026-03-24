import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
