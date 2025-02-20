const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router(); // 🔹 Definindo o Router corretamente

// Criar um novo usuário no Firestore
router.post("/create-user", async (req, res) => {
  const { uid, name, email } = req.body;

  console.log("Recebendo requisição para criar usuário:", { uid, name, email });

  if (!uid || !name || !email) {
    console.log("Erro: Dados incompletos");
    return res.status(400).json({ message: "Dados incompletos" });
  }

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log("Criando novo usuário:", uid);
    await userRef.set({
      name,
      email,
      points: 0,
      last_completed: "",
    });

    return res.status(201).json({ message: "Usuário criado com sucesso" });
  }

  console.log("Usuário já existe:", uid);
  res.status(200).json({ message: "Usuário já existe" });
});

module.exports = router; // 🔹 Exportando corretamente o Router
