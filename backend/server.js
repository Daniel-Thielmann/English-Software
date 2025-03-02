const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const pointsRoutes = require("./routes/points"); // Importa a rota de pontos
const rankingRoutes = require("./routes/ranking");

const app = express();

// 🔹 Middleware precisa vir antes das rotas!
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/auth", authRoutes);
app.use("/points", pointsRoutes); // Garante que a rota está registrada corretamente
app.use("/ranking", rankingRoutes); // Garante que a rota está registrada corretamente

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const { validateActivationKey } = require("./firebase-config");

(async () => {
  const testUserId = "g6k3EKZSFkMDg6doi6RexHqxjnU2"; // Substitua pelo UID do Firebase Auth
  const testActivationKey = "CODI123"; // Chave de ativação que você cadastrou

  const result = await validateActivationKey(testUserId, testActivationKey);
  console.log("🛠️ Teste de validação:", result);
})();

const { db } = require("./firebase-config");

(async () => {
  console.log("🔍 Testando conexão com Firestore...");

  // Tenta obter todas as chaves de ativação cadastradas
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
})();
