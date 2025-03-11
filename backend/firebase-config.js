const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "./.env" });

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    console.log("✅ Credenciais carregadas da variável de ambiente.");
  } catch (error) {
    console.error("❌ ERRO ao carregar FIREBASE_CREDENTIALS:", error.message);
    process.exit(1);
  }
} else {
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    console.log("✅ Credenciais carregadas do arquivo local.");
  } else {
    console.error("❌ ERRO: Nenhuma credencial Firebase encontrada!");
    process.exit(1);
  }
}

// 🔹 Inicializa o Firebase apenas se ainda não estiver rodando
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 🔹 Função para validar e ativar a chave no Firestore
const validateActivationKey = async (userId, activationKey) => {
  try {
    console.log(
      `🔍 Verificando chave: ${activationKey} para o usuário: ${userId}`
    );

    const keyRef = db.collection("activationKeys").doc(activationKey);
    const keyDoc = await keyRef.get();

    if (!keyDoc.exists) {
      throw new Error("❌ Chave inválida!");
    }

    if (keyDoc.data().isUsed) {
      throw new Error("❌ Chave já utilizada!");
    }

    console.log("✅ Chave encontrada e disponível para ativação!");

    // 🔹 Atualiza a chave no Firestore para marcar como usada
    await keyRef.update({
      isUsed: true,
      assignedTo: userId,
    });

    // 🔹 Verifica se o usuário já existe no Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(
        "⚠️ Usuário não encontrado no Firestore. Criando novo documento..."
      );
      await userRef.set({
        hasActivated: true, // Marca como ativado automaticamente
        createdAt: new Date().toISOString(), // Adiciona um timestamp da criação
      });
    } else {
      console.log("✅ Usuário encontrado! Atualizando status...");
      await userRef.update({ hasActivated: true });
    }

    console.log(
      `✅ Chave ${activationKey} ativada com sucesso para o usuário ${userId}`
    );
    return { success: true, message: "✅ Chave ativada com sucesso!" };
  } catch (error) {
    console.error("❌ Erro ao validar chave:", error.message);
    return { success: false, message: error.message };
  }
};

// 🔹 Função para testar a conexão com o Firestore
const testFirestoreConnection = async () => {
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
};

// 🔹 Executa o teste de conexão automaticamente na inicialização
testFirestoreConnection();

// 🔹 Exportação correta usando CommonJS
module.exports = { db, admin, validateActivationKey };
