require("dotenv").config(); // ✅ Importa variáveis do .env

const express = require("express");
const cors = require("cors");

// 🔹 Importação das rotas
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const pointsRoutes = require("./routes/points");
const rankingRoutes = require("./routes/ranking");
const textToSpeechRoutes = require("./routes/textToSpeech");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Registro das rotas
app.use("/api/users", userRoutes);
app.use("/text-to-speech", textToSpeechRoutes);
app.use("/auth", authRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/points", rankingRoutes); // 🔹 Corrigido para evitar conflito com /points

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
