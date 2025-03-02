const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

// 🔹 Rota para obter os 10 usuários com mais pontos
router.get("/ranking", async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("pointsSpeaking", "desc")
      .limit(10)
      .get();

    const ranking = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      pointsSpeaking: doc.data().pointsSpeaking || 0,
      pointsWriting: doc.data().pointsWriting || 0,
    }));

    res.json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro ao buscar ranking", error });
  }
});

module.exports = router;
