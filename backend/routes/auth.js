router.post("/validate-key", async (req, res) => {
  const { userId, key } = req.body;

  if (!userId || !key) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const userData = userSnap.data();

    if (userData.activationKey === key) {
      return res.json({ valid: true, message: "Chave válida!" });
    } else {
      return res.json({ valid: false, message: "Chave inválida!" });
    }
  } catch (error) {
    console.error("Erro ao validar chave:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
