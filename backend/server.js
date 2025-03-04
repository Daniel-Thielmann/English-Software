const express = require("express");
const cors = require("cors");

// 🔹 Importação das rotas
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const pointsRoutes = require("./routes/points");
const rankingRoutes = require("./routes/ranking");
const textToSpeechRoutes = require("./routes/textToSpeech");

const app = express();

// 🔹 Middleware para permitir CORS e evitar bloqueios
app.use(
  cors({
    origin: "https://seu-frontend.vercel.app", // Substitua pelo domínio do seu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'self' data: 'unsafe-inline' 'unsafe-eval'; font-src * data:; style-src * 'unsafe-inline';"
  );
  next();
});

// 🔹 Registro correto das rotas
app.use("/api/users", userRoutes);
app.use("/text-to-speech", textToSpeechRoutes);
app.use("/auth", authRoutes);
app.use("/points", pointsRoutes);
app.use("/points", rankingRoutes);

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// 🔹 Importação da função de validação de chave de ativação
const { validateActivationKey, db } = require("./firebase-config");

// 🔍 Teste assíncrono de conexão com Firestore
(async () => {
  try {
    console.log("🔍 Testando conexão com Firestore...");
    const testSnapshot = await db.collection("users").get();

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
