const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router(); // 🔹 Definindo corretamente o Router

// 🔹 Rota para obter os 10 usuários com mais pontos
router.get("/ranking", async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("pointsSpeaking", "desc") // 🔹 Atualizado para pointsSpeaking
      .limit(10)
      .get();

    const ranking = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      pointsSpeaking: doc.data().pointsSpeaking,
      pointsWriting: doc.data().pointsWriting,
    }));

    res.json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro ao buscar ranking", error });
  }
});

// 🔹 Criar um novo usuário no Firestore
router.post("/create-user", async (req, res) => {
  const { uid, name, email } = req.body;

  if (!uid || !name || !email) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        name,
        email,
        pointsSpeaking: 0, // 🔹 Inicializando corretamente
        pointsWriting: 0,
      });
      res.json({ message: "Usuário criado com sucesso!" });
    } else {
      res.json({ message: "Usuário já existe." });
    }
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro no servidor ao criar usuário." });
  }
});

// 🔹 Atualizar pontos de fala e escrita
router.post("/update-points", async (req, res) => {
  try {
    const { userId, pointsSpeaking, pointsWriting } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userData = userDoc.data();

    // 🔹 Se os pontos já existirem, acumular com os novos
    const newPointsSpeaking =
      (userData.pointsSpeaking || 0) + (pointsSpeaking || 0);
    const newPointsWriting =
      (userData.pointsWriting || 0) + (pointsWriting || 0);

    await userRef.update({
      pointsSpeaking: newPointsSpeaking,
      pointsWriting: newPointsWriting,
    });

    res.json({
      message: "Pontuação atualizada com sucesso!",
      pointsSpeaking: newPointsSpeaking,
      pointsWriting: newPointsWriting,
    });
  } catch (error) {
    console.error("Erro ao atualizar pontuação:", error);
    res.status(500).json({ error: "Erro ao atualizar pontuação." });
  }
});

// 🔹 Exportando corretamente o Router
module.exports = router;
