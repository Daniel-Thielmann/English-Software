const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

// Criar um novo usuário no Firestore
router.post("/create-user", async (req, res) => {
  const { uid, name, email } = req.body;

  if (!uid || !name || !email) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({
      name,
      email,
      points: 0,
      last_completed: "",
    });

    return res.status(201).json({ message: "Usuário criado com sucesso" });
  }

  res.status(200).json({ message: "Usuário já existe" });
});

module.exports = router;
