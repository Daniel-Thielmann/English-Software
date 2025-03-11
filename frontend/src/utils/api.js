import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-codi.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔥 API rodando em:", API_BASE_URL); // Para verificar qual URL está sendo usada

export default api;
