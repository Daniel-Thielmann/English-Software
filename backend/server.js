const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

// 🔹 Importação da configuração do Firebase antes das rotas
const { db } = require("./firebase-config");

// 🔹 Importação das rotas
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const pointsRoutes = require("./routes/points");
const rankingRoutes = require("./routes/ranking");
const textToSpeechRoutes = require("./routes/textToSpeech");

const app = express();

// 🔹 Middleware precisa vir antes das rotas!
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data:; " +
      "connect-src 'self' http://localhost:10000 https://backend-codi.onrender.com; "
  );
  next();
});

// 🔹 Registro correto das rotas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/text-to-speech", textToSpeechRoutes);

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// 🔍 Teste assíncrono de conexão com Firestore
(async () => {
  try {
    console.log("🔍 Testando conexão com Firestore...");
    const testSnapshot = await db.collection("users").limit(1).get();

    if (testSnapshot.empty) {
      console.log("⚠️ Nenhum usuário encontrado no Firestore.");
    } else {
      console.log("✅ Conexão com Firestore OK!");
      testSnapshot.forEach((doc) => {
        console.log(`🔑 Usuário: ${doc.id}, Dados:`, doc.data());
      });
    }
  } catch (error) {
    console.error("❌ Erro ao conectar ao Firestore:", error);
  }
})();
