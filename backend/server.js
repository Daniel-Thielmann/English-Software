const express = require("express");
const cors = require("cors");

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
app.use("/ranking", rankingRoutes); // Corrigido para não sobrescrever pointsRoutes

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// 🔹 Importação da função de validação de chave de ativação
const { validateActivationKey, db } = require("./firebase-config");

// 🔍 Teste assíncrono de validação de chave de ativação
(async () => {
  try {
    const testUserId = "g6k3EKZSFkMDg6doi6RexHqxjnU2"; // 🔹 Substitua pelo UID correto do Firebase Auth
    const testActivationKey = "CODI123"; // 🔹 Chave de ativação cadastrada

    const result = await validateActivationKey(testUserId, testActivationKey);
    console.log("🛠️ Teste de validação:", result);
  } catch (error) {
    console.error("❌ Erro ao validar chave:", error);
  }
})();

// 🔍 Teste assíncrono de conexão com Firestore
(async () => {
  try {
    console.log("🔍 Testando conexão com Firestore...");

    // 🔹 Obtém todas as chaves de ativação cadastradas
    const keysSnapshot = await db.collection("activationKeys").get();

    if (keysSnapshot.empty) {
      console.error(
        "❌ Nenhuma chave encontrada no Firestore! Verifique se a coleção está correta."
      );
    } else {
      console.log("✅ Chaves encontradas no Firestore:");
      keysSnapshot.forEach((doc) => {
        console.log(`🔑 ID: ${doc.id}, Dados:`, doc.data());
      });
    }
  } catch (error) {
    console.error("❌ Erro ao conectar ao Firestore:", error);
  }
})();
