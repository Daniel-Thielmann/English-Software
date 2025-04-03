import React, { useEffect, useState } from "react";
import "./TalkingComponent.css";
import { auth } from "../../../firebaseConfig";

const TalkingComponent = ({ setPointsSpeaking, finalizarPratica }) => {
  const [transcricao, setTranscricao] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(30 * 60); // 30 minutos
  const [pontuacaoAtual, setPontuacaoAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoRestante((tempo) => {
        if (tempo <= 1) {
          clearInterval(intervalo);
          finalizarPratica();
          return 0;
        }
        return tempo - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [finalizarPratica]);

  useEffect(() => {
    const intervaloAutoSave = setInterval(() => {
      salvarPontuacao();
    }, 60 * 1000); // a cada 1 minuto

    return () => clearInterval(intervaloAutoSave);
  }, [pontuacaoAtual]);

  const salvarPontuacao = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          pointsSpeaking: pontuacaoAtual,
        }),
      });

      console.log("✅ Pontuação salva automaticamente:", pontuacaoAtual);
    } catch (err) {
      console.error("❌ Erro ao salvar pontos automaticamente:", err);
    }
  };

  const formatarTempo = (segundos) => {
    const m = String(Math.floor(segundos / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

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
    setLoading(true);

    recognition.onresult = async (event) => {
      const textoFalado = event.results[0][0].transcript;
      setTranscricao(textoFalado);
      await conversarComIA(textoFalado);
    };

    recognition.onerror = (event) => {
      setLoading(false);
      console.error("Erro no reconhecimento:", event.error);
    };
  };

  const conversarComIA = async (mensagem) => {
    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/conversar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: mensagem }),
        }
      );

      const data = await resposta.json();
      setRespostaIA(data.resposta);

      // Soma pontos e envia ao pai
      setPontuacaoAtual((prev) => {
        const novo = prev + 2;
        setPointsSpeaking(novo);
        return novo;
      });

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      audio.play();

      setAudioSrc(`data:audio/mpeg;base64,${data.audioBase64}`);
    } catch (err) {
      console.error("Erro na conversa com IA:", err);
      setRespostaIA("Erro ao responder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="talking-component">
      <h2>🗣️ Conversando com a IA</h2>

      <div
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "0.5rem" }}
      >
        ⏳ Tempo restante: {formatarTempo(tempoRestante)}
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#00ff99",
          marginBottom: "1rem",
        }}
      >
        ⭐ Pontuação atual: {pontuacaoAtual}
      </div>

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

      <button onClick={finalizarPratica}>Encerrar Prática</button>
    </div>
  );
};

export default TalkingComponent;
