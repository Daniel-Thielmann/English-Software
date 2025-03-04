const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 🔹 Verifica se a variável de ambiente está definida
if (!process.env.FIREBASE_CREDENTIALS) {
  console.error(
    "❌ ERRO: Variável de ambiente FIREBASE_CREDENTIALS não encontrada!"
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// 🔹 Inicializa o Firebase Admin SDK corretamente
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

// 🔹 Exportação correta usando CommonJS
module.exports = { db, admin, validateActivationKey };
