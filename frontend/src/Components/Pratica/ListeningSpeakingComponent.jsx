import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProgressBar from "./ProgressBar";
import ModalAuth from "../ModalAuth/ModalAuth";
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
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      verificarAtivacao(user.uid);
    }
  }, [user]);

  const verificarAtivacao = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().hasActivated) {
        setIsActivated(true);
      } else {
        setModalOpen(true);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar ativação:", error);
    }
  };

  const validarChaveDeAtivacao = async (activationKey) => {
    if (!user) {
      alert("❌ Você precisa estar logado para ativar sua conta!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, activationKey }),
      });

      const data = await response.json();
      console.log("🔍 Resposta da API:", data); // 🛠️ Log para depuração

      if (response.ok && data.success) {
        alert(data.message);
        setIsActivated(true);
        setModalOpen(false);
      } else {
        alert(
          `❌ Erro: ${data.message || "Erro desconhecido ao validar chave."}`
        );
      }
    } catch (error) {
      alert(
        "❌ Erro ao validar chave. Verifique sua conexão e tente novamente."
      );
      console.error("❌ Erro no fetch:", error);
    }
  };

  const iniciarReconhecimentoVoz = () => {
    if (!isActivated) {
      alert("⚠️ Você precisa ativar sua conta antes de iniciar as atividades.");
      return;
    }

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
      recognition.stop();
      setGravando(false);
    };

    recognition.onerror = (event) => {
      setGravando(false);
      if (event.error === "no-speech") {
        alert("Nenhum som detectado! Fale mais alto e tente novamente.");
      }
    };
  };

  return (
    <div className="container-speaking">
      <h2>🎤 Listening & Speaking</h2>

      {/* Modal de ativação */}
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={validarChaveDeAtivacao}
      />

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
