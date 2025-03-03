const express = require("express");
const gTTS = require("gtts");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.post("/generate-audio", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto não fornecido!" });
  }

  try {
    const gtts = new gTTS(text, "en");
    const filePath = path.join(__dirname, "audio.mp3");

    gtts.save(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao gerar áudio!" });
      }

      res.sendFile(filePath, () => {
        fs.unlinkSync(filePath); // Remove o arquivo após envio
      });
    });
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    res.status(500).json({ error: "Erro interno no servidor!" });
  }
});

// Exportando a rota corretamente
module.exports = router;
