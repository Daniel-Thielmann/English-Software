const express = require("express");
const cors = require("cors");
const { validateActivationKey, db } = require("./firebase-config");

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

// 🔹 Registro correto das rotas
app.use("/api/users", userRoutes);
app.use("/text-to-speech", textToSpeechRoutes);
app.use("/auth", authRoutes);
app.use("/points", pointsRoutes);
app.use("/ranking", rankingRoutes); // 🔹 Agora separado de "/points"

// 🔹 Middleware Global de Tratamento de Erros
app.use((err, req, res, next) => {
  console.error("🔥 Erro no servidor:", err);
  res
    .status(500)
    .json({ message: "Erro interno do servidor", error: err.message });
});

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

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
