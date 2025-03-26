import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProgressBar from "../ProgressBar";
import ModalAuth from "../../ModalAuth/ModalAuth";
import ModalSpeaking from "../../Modal/ModalSpeaking";
import frases from "../../../utils/frases.json";
import "./ListeningSpeakingComponent.css";

const embaralharArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ListeningSpeakingComponent = () => {
  const [fraseAtualIndex, setFraseAtualIndex] = useState(0);
  const [transcricao, setTranscricao] = useState("");
  const [pointsSpeaking, setPointsSpeaking] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSpeakingOpen, setModalSpeakingOpen] = useState(false);
  const [erros, setErros] = useState(0);
  const [frasesCompletadasHoje, setFrasesCompletadasHoje] = useState(0);
  const [frasesEmbaralhadas, setFrasesEmbaralhadas] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const frasesHoje = localStorage.getItem("frasesCompletadasHoje");
    const usuarioFrases = localStorage.getItem("usuarioFrases");
    if (frasesHoje && usuarioFrases === user.uid) {
      setFrasesCompletadasHoje(parseInt(frasesHoje, 10));
    } else {
      localStorage.removeItem("frasesCompletadasHoje");
      localStorage.removeItem("usuarioFrases");
      setFrasesCompletadasHoje(0);
    }
  }, [user]);

  useEffect(() => {
    const verificarAtivacao = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        setIsActivated(userDoc.exists() && userDoc.data().hasActivated);
        if (!userDoc.exists() || !userDoc.data().hasActivated) {
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Erro ao verificar ativação:", error);
      }
    };
    verificarAtivacao();
  }, [user]);

  const iniciarPratica = () => {
    if (!isActivated) {
      alert("⚠️ Ative sua conta antes de começar.");
      return;
    }
    if (frasesCompletadasHoje >= 10) {
      alert("⚠️ Você já completou as 10 frases de hoje.");
      return;
    }
    const frasesAleatorias = embaralharArray([...frases]);
    setFrasesEmbaralhadas(frasesAleatorias);
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
    recognition.maxAlternatives = 1;

    recognition.start();
    setGravando(true);

    recognition.onresult = (event) => {
      const textoFalado = event.results[0][0].transcript;
      setTranscricao(textoFalado);
      recognition.stop();
      setGravando(false);

      const limparTexto = (t) =>
        t
          .toLowerCase()
          .trim()
          .replace(/[.,!?]/g, "");

      const certo = limparTexto(frasesEmbaralhadas[fraseAtualIndex]);
      const falado = limparTexto(textoFalado);

      if (falado === certo) {
        setPointsSpeaking((p) => p + 10);
        setProgresso((p) => Math.min(p + 10, 100));

        const feitas = frasesCompletadasHoje + 1;
        setFrasesCompletadasHoje(feitas);
        localStorage.setItem("frasesCompletadasHoje", feitas);
        localStorage.setItem("usuarioFrases", user.uid);

        if (feitas >= 10) return finalizarPratica();

        if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
          setFraseAtualIndex((i) => i + 1);
        } else {
          finalizarPratica();
        }
      } else {
        setErros((e) => e + 1);
        if (erros >= 2) {
          alert("⚠️ Você errou 3 vezes. Use o botão Pular.");
        } else {
          alert("❌ Resposta incorreta. Tente novamente!");
        }
      }
    };

    recognition.onerror = () => {
      setGravando(false);
      alert("Nenhum som detectado. Tente novamente.");
    };
  };

  const pularFrase = () => {
    const novas = frasesCompletadasHoje + 1;
    setFrasesCompletadasHoje(novas);
    localStorage.setItem("frasesCompletadasHoje", novas);
    localStorage.setItem("usuarioFrases", user.uid);

    if (novas >= 10) return finalizarPratica();

    if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
      setFraseAtualIndex((i) => i + 1);
      setErros(0);
    } else {
      finalizarPratica();
    }
  };

  const salvarPontosSpeaking = async (pontos) => {
    if (!user) return;
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/points/update-speaking-points`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, pointsSpeaking: pontos }),
        }
      );
    } catch (err) {
      console.error("Erro ao salvar pontos:", err);
    }
  };

  const finalizarPratica = async () => {
    await salvarPontosSpeaking(pointsSpeaking);
    setModalSpeakingOpen(true);
  };

  const handleNavigateToFinal = () => {
    setModalSpeakingOpen(false);
    navigate("/tela-final-speaking", { state: { pointsSpeaking } });
  };

  if (!frasesEmbaralhadas.length) {
    return (
      <div className="start-section">
        <ModalAuth
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={(chave) => {}}
        />
        <button className="start-button" onClick={iniciarPratica}>
          Iniciar Prática de Listening & Speaking
        </button>
      </div>
    );
  }

  return (
    <div className="listening-speaking-container">
      {modalSpeakingOpen && (
        <ModalSpeaking
          message="Parabéns! Você concluiu sua prática diária."
          onClose={handleNavigateToFinal}
          acertos={pointsSpeaking / 10}
          showDoneBtn={true}
        />
      )}

      <div className="practice-content">
        <ProgressBar progresso={progresso} />
        <p className="frase">{frasesEmbaralhadas[fraseAtualIndex]}</p>
        <button
          className="btn-speak"
          onClick={iniciarReconhecimentoVoz}
          disabled={gravando}
        >
          {gravando ? "🎙️ Ouvindo..." : "🎤 Falar"}
        </button>
        {erros >= 3 && (
          <button className="btn-skip" onClick={pularFrase}>
            ⏭️ Pular
          </button>
        )}
        {transcricao && (
          <p className="transcricao">🗣️ Você disse: {transcricao}</p>
        )}
        <p className="pointsSpeaking">⭐ Pontuação: {pointsSpeaking}</p>
      </div>
    </div>
  );
};

export default ListeningSpeakingComponent;
