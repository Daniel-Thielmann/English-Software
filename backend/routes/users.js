const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router(); // 🔹 Definindo o Router corretamente

// Rota para obter os 10 usuários com mais pontos
router.get("/ranking", async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("points", "desc") // Ordena os usuários por pontos (maior primeiro)
      .limit(10) // Pega apenas os 10 melhores
      .get();

    const ranking = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      points: doc.data().points,
    }));

    res.json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro ao buscar ranking", error });
  }
});

module.exports = router;

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

router.post("/update-points", async (req, res) => {
  const { userId, points } = req.body;

  if (!userId || points === undefined) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      points: points, // 🔹 Atualiza o total de pontos do usuário
    });

    res.json({ message: "Pontos atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar pontos:", error);
    res.status(500).json({ message: "Erro ao atualizar pontos" });
  }
});
