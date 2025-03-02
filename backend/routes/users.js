const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

// 🔹 Criar um novo usuário no Firestore
router.post("/create-user", async (req, res) => {
  const { uid, email, name } = req.body;

  if (!uid || !email) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        email,
        name: name || "Usuário",
        pointsSpeaking: 0,
        pointsWriting: 0,
        hasActivated: false,
      });
      res.json({ message: "Usuário criado com sucesso!" });
    } else {
      res.json({ message: "Usuário já existe." });
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro no servidor ao criar usuário." });
  }
});

module.exports = router;
