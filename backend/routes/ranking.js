const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

// 🔹 Rota para obter os 10 usuários com mais pontos totais
router.get("/ranking", async (req, res) => {
  // 🔥 A rota precisa ser EXATAMENTE "/ranking"
  try {
    const snapshot = await db.collection("users").get();

    let ranking = snapshot.docs.map((doc) => {
      const userData = doc.data();
      return {
        id: doc.id,
        name: userData.name || "Usuário Anônimo",
        pointsSpeaking: userData.pointsSpeaking || 0,
        pointsWriting: userData.pointsWriting || 0,
        totalPoints:
          (userData.pointsSpeaking || 0) + (userData.pointsWriting || 0), // 🔥 Soma dos pontos
      };
    });

    // 🔹 Ordenar os usuários pela maior pontuação total
    ranking.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(ranking.slice(0, 10));
  } catch (error) {
    console.error("❌ Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro ao buscar ranking", error });
  }
});

module.exports = router;
