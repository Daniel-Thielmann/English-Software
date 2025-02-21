import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import ProgressBar from "./ProgressBar";
import "./ListeningSpeakingComponent.css";

const frases = [
  "The quick brown fox jumps over the lazy dog.",
  "I love programming in JavaScript.",
  "Practice makes perfect.",
];

const ListeningSpeakingComponent = () => {
  const [fraseAtualIndex, setFraseAtualIndex] = useState(0);
  const [transcricao, setTranscricao] = useState("");
  const [pontuacao, setPontuacao] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [totalPontosFala, setTotalPontosFala] = useState(0);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const iniciarReconhecimentoVoz = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Seu navegador não suporta reconhecimento de voz. Tente no Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setGravando(true);

    recognition.onresult = (event) => {
      const textoFalado = event.results[0][0].transcript;
      console.log("🗣️ Transcrição:", textoFalado);
      setTranscricao(textoFalado);
      setGravando(false);
      avaliarPronuncia(textoFalado);
    };

    recognition.onspeechend = () => {
      console.log("🎙️ Parou de ouvir. Processando...");
      recognition.stop();
      setGravando(false);
    };

    recognition.onerror = (event) => {
      console.error("❌ Erro no reconhecimento de voz:", event.error);
      setGravando(false);

      if (event.error === "no-speech") {
        alert("Nenhum som detectado! Fale mais alto e tente novamente.");
      }
    };

    recognition.onend = () => {
      setGravando(false);
    };
  };

  const avaliarPronuncia = (textoFalado) => {
    if (!textoFalado) {
      console.error("❌ Nenhuma transcrição recebida!");
      return;
    }

    const original = frases[fraseAtualIndex].toLowerCase();
    const falado = textoFalado.toLowerCase();
    const similaridade = calcularSimilaridade(original, falado);
    setPontuacao(similaridade);

    const novaPontuacaoTotal = totalPontosFala + similaridade;
    setTotalPontosFala(novaPontuacaoTotal);

    if (user) {
      salvarPontuacao(user.uid, novaPontuacaoTotal);
    }

    setTimeout(() => {
      atualizarProgressoEProximaFrase();
    }, 1500);
  };

  const calcularSimilaridade = (texto1, texto2) => {
    const palavrasOriginais = texto1.split(" ");
    const palavrasFaladas = texto2.split(" ");
    let acertos = 0;

    palavrasOriginais.forEach((palavra, index) => {
      if (palavrasFaladas[index] === palavra) {
        acertos++;
      }
    });

    return Math.round((acertos / palavrasOriginais.length) * 10);
  };

  const salvarPontuacao = (userId, pointsSpeaking) => {
    fetch("http://localhost:3000/api/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, pointsSpeaking }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Pontos de Fala atualizados:", data))
      .catch((err) => console.error("❌ Erro ao salvar pontuação:", err));
  };

  const atualizarProgressoEProximaFrase = () => {
    setProgresso((prevProgresso) => {
      const novoProgresso = Math.min(prevProgresso + 100 / frases.length, 100);

      if (novoProgresso === 100) {
        finalizarPratica();
      }

      return novoProgresso;
    });

    if (fraseAtualIndex < frases.length - 1) {
      setFraseAtualIndex(fraseAtualIndex + 1);
      setTranscricao("");
      setPontuacao(0);
    }
  };

  const finalizarPratica = () => {
    setTimeout(() => {
      navigate("/tela-final", { state: { pointsSpeaking: totalPontosFala } });
    }, 1500);
  };

  return (
    <div className="container-speaking">
      <h2>🎤 Listening & Speaking</h2>

      {/* Barra de Progresso */}
      <ProgressBar progress={progresso} />

      <p className="frase">{frases[fraseAtualIndex]}</p>
      <button
        className="btn-speak"
        onClick={iniciarReconhecimentoVoz}
        disabled={gravando}
      >
        {gravando ? "🎙️ Ouvindo..." : "🎤 Falar"}
      </button>
      {transcricao && (
        <p className="transcricao">🗣️ Você disse: {transcricao}</p>
      )}
      {pontuacao !== null && (
        <p className="pontuacao">⭐ Pontuação: {pontuacao} / 10</p>
      )}
    </div>
  );
};

export default ListeningSpeakingComponent;
