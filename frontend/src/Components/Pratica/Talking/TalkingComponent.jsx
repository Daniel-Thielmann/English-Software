import React, { useState } from "react";
import "./TalkingComponent.css";

const TalkingComponent = () => {
  const [transcricao, setTranscricao] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const iniciarReconhecimentoVoz = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();
    console.log("🎤 Reconhecimento de voz iniciado...");

    recognition.onresult = async (event) => {
      const textoFalado = event.results[0][0].transcript;
      console.log("✅ Texto capturado:", textoFalado);
      setTranscricao(textoFalado);
      await gerarRespostaComHuggingFace(textoFalado);
    };

    recognition.onerror = (event) => {
      console.error("❌ Erro no reconhecimento:", event.error);
    };
  };

  const gerarRespostaComHuggingFace = async (mensagem) => {
    setLoading(true);
    console.log("🧠 Enviando para DialoGPT:", mensagem);

    try {
      const resposta = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `The user said: "${mensagem}". Reply like an English conversation tutor.`,
          }),
        }
      );

      const data = await resposta.json();

      if (data.error) {
        console.error("❌ Erro HuggingFace:", data.error);
        setRespostaIA("Desculpe, ocorreu um erro na resposta da IA.");
        return;
      }

      const respostaGerada =
        data.generated_text || "Sorry, I didn't understand that.";
      console.log("✅ Resposta da IA:", respostaGerada);
      setRespostaIA(respostaGerada);
      await converterTextoEmAudio(respostaGerada);
    } catch (error) {
      console.error("❌ Erro ao consultar HuggingFace:", error);
      setRespostaIA("Erro ao gerar resposta.");
    } finally {
      setLoading(false);
    }
  };

  const converterTextoEmAudio = async (texto) => {
    console.log("🔊 Gerando áudio com ElevenLabs:", texto);

    try {
      const resposta = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${
          import.meta.env.VITE_ELEVENLABS_VOICE_ID
        }`,
        {
          method: "POST",
          headers: {
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: texto,
            voice_settings: {
              stability: 0.4,
              similarity_boost: 0.7,
            },
          }),
        }
      );

      if (!resposta.ok) {
        console.error("❌ ElevenLabs falhou:", await resposta.text());
        return;
      }

      const blob = await resposta.blob();
      const urlAudio = URL.createObjectURL(blob);
      setAudioSrc(urlAudio);
      console.log("✅ Áudio gerado com sucesso!");
    } catch (error) {
      console.error("❌ Erro no ElevenLabs:", error);
    }
  };

  return (
    <div className="talking-component">
      <h2>🗣️ Converse com a IA</h2>
      <button onClick={iniciarReconhecimentoVoz} disabled={loading}>
        🎤 Falar
      </button>

      {transcricao && (
        <p className="resumo">
          <strong>Você:</strong> {transcricao}
        </p>
      )}

      {respostaIA && (
        <p className="resposta">
          <strong>IA:</strong> {respostaIA}
        </p>
      )}

      {audioSrc && (
        <audio controls autoPlay>
          <source src={audioSrc} type="audio/mpeg" />
          Seu navegador não suporta áudio.
        </audio>
      )}

      {loading && <p className="loading">⏳ A IA está respondendo...</p>}
    </div>
  );
};

export default TalkingComponent;
