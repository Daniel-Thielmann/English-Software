const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: "./.env" });

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
    "default-src * 'self' data: 'unsafe-inline' 'unsafe-eval'; font-src * data:; style-src * 'unsafe-inline' https://fonts.googleapis.com; font-src * https://fonts.gstatic.com;"
  );
  next();
});

// 🔹 Registro correto das rotas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/ranking", rankingRoutes); // 🔥 Corrigido para garantir que ranking funcione

// 🔹 Configuração da porta do servidor
const PORT = process.env.PORT || 10000;
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
