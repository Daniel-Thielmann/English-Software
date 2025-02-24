const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

// Adiciona a rota do ranking
app.use("/api", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
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
