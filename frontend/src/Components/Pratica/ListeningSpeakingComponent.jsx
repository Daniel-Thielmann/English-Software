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
  const [pointsSpeaking, setPointsSpeaking] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [praticaIniciada, setPraticaIniciada] = useState(false);
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

  const iniciarPratica = () => {
    setPraticaIniciada(true);
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
    <div
      className="listening-speaking-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ModalAuth isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      {!praticaIniciada ? (
        <div className="start-section" style={{ textAlign: "center" }}>
          <p className="body-text">
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            repeti-las corretamente para aprimorar sua pronúncia e compreensão
            auditiva.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você pode reproduzir o áudio quantas vezes quiser antes de
            repetir.
            <br />
            <br />
            - Sua resposta deve ser o mais próxima possível da frase original.
            <br />
            <br />
            - Pronúncia e entonação são avaliadas pela IA.
            <br />
            <br />
            - Se errar, você poderá tentar novamente antes de avançar.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e fala treinando diariamente.
          </p>

          <button className="start-button" onClick={iniciarPratica}>
            Iniciar Prática de Listening & Speaking
          </button>
        </div>
      ) : (
        <div className="practice-content" style={{ textAlign: "center" }}>
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
          {pointsSpeaking !== null && (
            <p className="pointsSpeaking">
              ⭐ Pontuação: {pointsSpeaking} / 10
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListeningSpeakingComponent;
