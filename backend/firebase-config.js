const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 🔹 Caminho seguro para o arquivo de credenciais
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ ERRO: Arquivo serviceAccountKey.json não encontrado!");
  process.exit(1); // Encerra o programa se a chave não for encontrada
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// 🔹 Inicializa o Firebase Admin SDK corretamente
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db, admin };
