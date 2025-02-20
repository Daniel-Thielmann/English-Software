const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

router.post("/update-points", async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send("ID do usuário é obrigatório");

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return res.status(404).send("Usuário não encontrado");
  }

  const userData = userDoc.data();
  const today = new Date().toISOString().split("T")[0];

  if (userData.last_completed === today) {
    return res.status(400).send("Usuário já concluiu hoje");
  }

  await userRef.update({
    points: (userData.points || 0) + 10,
    last_completed: today,
  });

  res.send("Pontos atualizados com sucesso!");
});

module.exports = router;
