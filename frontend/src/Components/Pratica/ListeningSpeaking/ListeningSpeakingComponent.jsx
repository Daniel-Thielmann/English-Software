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

        if (userDoc.exists() && userDoc.data().hasActivated) {
          setIsActivated(true);
        } else {
          setModalOpen(true);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar ativação:", error);
      }
    };

    verificarAtivacao();
  }, [user]);

  useEffect(() => {
    if (user && !frasesEmbaralhadas.length) {
      const frasesAleatorias = embaralharArray([...frases]);
      setFrasesEmbaralhadas(frasesAleatorias);
    }
  }, [user]);

  const validarChaveDeAtivacao = async (activationKey) => {
    if (!user) {
      alert("❌ Você precisa estar logado para ativar sua conta!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/validate-key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, activationKey }),
        }
      );

      const data = await response.json();

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
      setTranscricao(textoFalado);
      recognition.stop();
      setGravando(false);

      const limparTexto = (texto) =>
        texto
          .toLowerCase()
          .trim()
          .replace(/[.,!?]/g, "");

      const respostaUsuario = limparTexto(textoFalado);
      const respostaCorreta = limparTexto(frasesEmbaralhadas[fraseAtualIndex]);

      if (respostaUsuario === respostaCorreta) {
        alert("✅ Correto! Próxima frase...");
        setPointsSpeaking((prev) => prev + 10);
        setProgresso((prev) => Math.min(prev + 10, 100));

        const novasFrasesCompletadas = frasesCompletadasHoje + 1;
        setFrasesCompletadasHoje(novasFrasesCompletadas);
        localStorage.setItem("frasesCompletadasHoje", novasFrasesCompletadas);
        localStorage.setItem("usuarioFrases", user.uid);

        if (novasFrasesCompletadas >= 10) {
          finalizarPratica();
          return;
        }

        if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
          setFraseAtualIndex((prev) => prev + 1);
        } else {
          finalizarPratica();
        }
      } else {
        setErros((prev) => prev + 1);
        if (erros >= 2) {
          alert("❌ Você errou 3 vezes. Pressione 'Pular' para avançar.");
        } else {
          alert("❌ Tente novamente! Sua resposta não está correta.");
        }
      }
    };

    recognition.onerror = (event) => {
      setGravando(false);
      if (event.error === "no-speech") {
        alert("Nenhum som detectado! Fale mais alto e tente novamente.");
      }
    };
  };

  const pularFrase = () => {
    const novasFrasesCompletadas = frasesCompletadasHoje + 1;
    setFrasesCompletadasHoje(novasFrasesCompletadas);
    localStorage.setItem("frasesCompletadasHoje", novasFrasesCompletadas);
    localStorage.setItem("usuarioFrases", user.uid);

    if (novasFrasesCompletadas >= 10) {
      finalizarPratica();
      return;
    }

    if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
      setFraseAtualIndex((prev) => prev + 1);
      setErros(0);
    } else {
      finalizarPratica();
    }
  };

  const salvarPontosSpeaking = async (pontos) => {
    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/points/update-speaking-points`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            pointsSpeaking: pontos,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Erro ao salvar pontos:", error);
    }
  };

  const finalizarPratica = async () => {
    const pontos = pointsSpeaking;
    await salvarPontosSpeaking(pontos);
    setModalSpeakingOpen(true);
  };

  const handleNavigateToFinal = () => {
    setModalSpeakingOpen(false);
    navigate("/tela-final-speaking", { state: { pointsSpeaking } });
  };

  return (
    <div className="listening-speaking-container">
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={validarChaveDeAtivacao}
        onSuccess={() => {
          setIsActivated(true);
          window.location.reload(); // ✅ recarrega página para iniciar prática corretamente
        }}
      />

      {modalSpeakingOpen && (
        <ModalSpeaking
          message="Parabéns! Você concluiu sua prática diária."
          onClose={handleNavigateToFinal}
          acertos={pointsSpeaking / 10}
          showDoneBtn={true}
        />
      )}

      {frasesEmbaralhadas.length > 0 && (
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
      )}
    </div>
  );
};

export default ListeningSpeakingComponent;
