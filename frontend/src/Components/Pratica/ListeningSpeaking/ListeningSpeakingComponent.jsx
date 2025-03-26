import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProgressBar from "../ProgressBar";
import ModalAuth from "../../ModalAuth/ModalAuth";
import ModalSpeaking from "../../Modal/ModalSpeaking"; // 🔹 Importação do ModalSpeaking
import frases from "../../../utils/frases.json"; // 🔹 Importação do frases.json
import "./ListeningSpeakingComponent.css";

// 🔹 Função para embaralhar o array (Fisher-Yates)
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
  const [praticaIniciada, setPraticaIniciada] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSpeakingOpen, setModalSpeakingOpen] = useState(false); // 🔹 Estado do modal de speaking
  const [erros, setErros] = useState(0); // 🔹 Contador de erros
  const [frasesCompletadasHoje, setFrasesCompletadasHoje] = useState(0); // 🔹 Contador de frases completadas hoje
  const [frasesEmbaralhadas, setFrasesEmbaralhadas] = useState([]); // 🔹 Array de frases embaralhadas
  const navigate = useNavigate();
  const user = auth.currentUser;

  // 🔹 Verificar se o usuário já completou 10 frases hoje
  useEffect(() => {
    if (!user) return;

    const frasesHoje = localStorage.getItem("frasesCompletadasHoje");
    const usuarioFrases = localStorage.getItem("usuarioFrases");

    // 🔹 Verificar se o usuário atual é o mesmo que completou as frases
    if (frasesHoje && usuarioFrases === user.uid) {
      setFrasesCompletadasHoje(parseInt(frasesHoje, 10));
    } else {
      // 🔹 Resetar o localStorage se o usuário for diferente
      localStorage.removeItem("frasesCompletadasHoje");
      localStorage.removeItem("usuarioFrases");
      setFrasesCompletadasHoje(0);
    }
  }, [user]);

  // 🔹 Verificar ativação do usuário
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

  // 🔹 Iniciar prática
  const iniciarPratica = () => {
    if (!isActivated) {
      alert("⚠️ Você precisa ativar sua conta antes de iniciar as atividades.");
      return;
    }

    if (frasesCompletadasHoje >= 10) {
      alert("⚠️ Você já completou o limite diário de 10 frases.");
      return;
    }

    // 🔹 Embaralhar as frases antes de iniciar a prática
    const frasesAleatorias = embaralharArray([...frases]);
    setFrasesEmbaralhadas(frasesAleatorias);

    setPraticaIniciada(true);
  };

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
      console.log("🔍 Resposta da API:", data);

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

  // 🔹 Iniciar reconhecimento de voz
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
      recognition.stop();
      setGravando(false);

      // 🔹 Normalização de texto para comparação
      const limparTexto = (texto) =>
        texto
          .toLowerCase()
          .trim()
          .replace(/[.,!?]/g, "");

      const respostaUsuario = limparTexto(textoFalado);
      const respostaCorreta = limparTexto(frasesEmbaralhadas[fraseAtualIndex]);

      // 🔹 Comparação
      if (respostaUsuario === respostaCorreta) {
        alert("✅ Correto! Próxima frase...");
        setPointsSpeaking((prevPoints) => prevPoints + 10);

        setProgresso((prevProgresso) => Math.min(prevProgresso + 10, 100));

        // 🔹 Atualizar frases completadas hoje
        const novasFrasesCompletadas = frasesCompletadasHoje + 1;
        setFrasesCompletadasHoje(novasFrasesCompletadas);
        localStorage.setItem("frasesCompletadasHoje", novasFrasesCompletadas);
        localStorage.setItem("usuarioFrases", user.uid); // 🔹 Armazena o ID do usuário

        // 🔹 Verificar se atingiu o limite diário
        if (novasFrasesCompletadas >= 10) {
          finalizarPratica(); // 🔹 Finalizar prática ao atingir o limite
          return;
        }

        // 🔹 Avançar para a próxima frase
        if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
          setFraseAtualIndex((prevIndex) => prevIndex + 1);
        } else {
          finalizarPratica();
        }
      } else {
        setErros((prevErros) => prevErros + 1); // 🔹 Incrementar contador de erros
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

  // 🔹 Pular para a próxima frase
  const pularFrase = () => {
    // 🔹 Atualizar frases completadas hoje
    const novasFrasesCompletadas = frasesCompletadasHoje + 1;
    setFrasesCompletadasHoje(novasFrasesCompletadas);
    localStorage.setItem("frasesCompletadasHoje", novasFrasesCompletadas);
    localStorage.setItem("usuarioFrases", user.uid); // 🔹 Armazenar ID do usuário

    // 🔹 Verificar se atingiu o limite diário
    if (novasFrasesCompletadas >= 10) {
      finalizarPratica(); // 🔹 Finalizar prática ao atingir o limite
      return;
    }

    // 🔹 Avançar para a próxima frase
    if (fraseAtualIndex < frasesEmbaralhadas.length - 1) {
      setFraseAtualIndex((prevIndex) => prevIndex + 1);
      setErros(0); // 🔹 Resetar contador de erros
    } else {
      finalizarPratica();
    }
  };

  // 🔹 Envia os pontos de fala para o backend
  const salvarPontosSpeaking = async (pontos) => {
    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    console.log("🔹 Enviando pontos de fala para o backend:", {
      userId: user.uid,
      pointsSpeaking: pontos,
    });

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
      console.log("✅ Pontos de Fala salvos no backend:", data);
      return data;
    } catch (error) {
      console.error("❌ Erro ao salvar pontos:", error);
    }
  };

  // 🔹 Finaliza a prática e abre o modal de Speaking
  const finalizarPratica = async () => {
    const pontos = pointsSpeaking;
    await salvarPontosSpeaking(pontos);
    setModalSpeakingOpen(true); // 🔹 Abre o modal Speaking ao finalizar
  };

  // 🔹 Função chamada pelo botão do `ModalSpeaking`
  const handleNavigateToFinal = () => {
    setModalSpeakingOpen(false);
    navigate("/tela-final-speaking", { state: { pointsSpeaking } });
  };

  return (
    <div className="listening-speaking-container">
      {/* 🔹 Modal de Ativação */}
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={validarChaveDeAtivacao}
      />
      {/* 🔹 ModalSpeaking aparece ao finalizar a prática */}
      {modalSpeakingOpen && (
        <ModalSpeaking
          message="Parabéns! Você concluiu sua prática diária."
          onClose={handleNavigateToFinal}
          acertos={pointsSpeaking / 10}
          showDoneBtn={true}
        />
      )}

      {!praticaIniciada ? (
        <div className="start-section">
          <p className="body-text">
            {" "}
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            repeti-las corretamente para aprimorar sua pronúncia e compreensão
            auditiva. <br /> <br /> 📜 Regras da Atividade: <br /> <br /> - Você
            pode reproduzir o áudio quantas vezes quiser antes de repetir.{" "}
            <br /> <br /> - Sua resposta deve ser o mais próxima possível da
            frase original. <br /> <br /> - Pronúncia e entonação são avaliadas
            pela IA. <br /> <br /> - Se errar, você poderá tentar novamente
            antes de avançar. <br /> <br /> 🎯 Objetivo: Melhore sua escuta e
            fala treinando diariamente.{" "}
          </p>
          <button className="start-button" onClick={iniciarPratica}>
            Iniciar Prática de Listening & Speaking
          </button>
        </div>
      ) : (
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
          {erros >= 3 && ( // 🔹 Mostrar botão de pular após 3 erros
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
