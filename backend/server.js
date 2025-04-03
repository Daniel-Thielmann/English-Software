require("dotenv").config(); // ✅ Importa variáveis do .env

const express = require("express");
const cors = require("cors");

// 🔹 Importação das rotas
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const pointsRoutes = require("./routes/points");
const rankingRoutes = require("./routes/ranking");
const textToSpeechRoutes = require("./routes/textToSpeech");
const chatRoute = require("./routes/chat"); // ✅ Nova rota para integração com ChatGPT
const conversarRoute = require("./routes/conversar");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/conversar", conversarRoute);
// 🔹 Registro das rotas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/ranking", rankingRoutes); // ✅ Corrigido: separa rota /ranking
app.use("/api/text-to-speech", textToSpeechRoutes);
app.use("/api/chat", chatRoute); // ✅ Rota para ChatGPT

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
