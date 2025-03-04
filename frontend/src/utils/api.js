import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-codi.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para capturar erros mais detalhados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Erro na API:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
