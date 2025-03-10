import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConteudoPratica from "./ConteudoPratica";
import "../../global.css";
import "./ListeningWritingComponent.css";
import ProgressBar from "./ProgressBar";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ModalAuth from "../ModalAuth/ModalAuth";

const ListeningWritingComponent = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [praticaConcluida, setPraticaConcluida] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      verificarAtivacao(user.uid);
    }
  }, [user]);

  // 🔹 Verifica se a conta já foi ativada no Firestore
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

  // 🔹 Envia a chave de ativação para o backend
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

  // 🔹 Só inicia a prática se a conta estiver ativada
  const comecarPratica = () => {
    if (!isActivated) {
      alert("⚠️ Você precisa ativar sua conta antes de iniciar as atividades.");
      return;
    }

    setPraticando(true);
    setPraticaConcluida(false);
    setProgresso(0);
    setAcertos(0);
  };

  // 🔹 Atualiza o progresso da atividade
  const atualizarProgresso = () => {
    setProgresso((prevProgresso) => {
      const novoValor = Math.min(prevProgresso + 10, 100);
      console.log("Novo progresso:", novoValor);

      if (novoValor === 100) {
        finalizarPratica();
      }

      return novoValor;
    });
  };

  // 🔹 Função para enviar pontos de escrita para o backend
  const salvarPontosEscrita = async (pontos) => {
    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    console.log("🔹 Enviando pontos de escrita para o backend:", {
      userId: user.uid,
      pointsWriting: pontos,
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-writing-points`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            pointsWriting: pontos,
          }),
        }
      );

      const data = await response.json();
      console.log("✅ Pontos de Escrita salvos no backend:", data);

      return data;
    } catch (error) {
      console.error("❌ Erro ao salvar pontos:", error);
    }
  };

  // 🔹 Finaliza a prática e salva os pontos
  const finalizarPratica = async () => {
    const pontos = acertos * 10; // Calcula os pontos com base nos acertos
    await salvarPontosEscrita(pontos);

    setTimeout(() => {
      navigate("/tela-final", { state: { pointsWriting: pontos } });
    }, 500);
  };

  return (
    <div className="listening-writing-container">
      {/* 🔹 Modal de Ativação */}
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={validarChaveDeAtivacao}
      />

      {praticaConcluida ? (
        <div className="final-screen">
          <TelaFinal
            pointsWriting={acertos * 10}
            progresso={progresso}
            voltarParaInicio={() => setPraticando(false)}
          />
          <p className="final-message">Parabéns! Você concluiu a prática.</p>
        </div>
      ) : praticando ? (
        <div className="practice-content">
          <ProgressBar progresso={progresso} />
          <ConteudoPratica
            setProgresso={atualizarProgresso}
            setAcertos={setAcertos}
          />
        </div>
      ) : (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            digitá-las corretamente para aprimorar sua compreensão auditiva e
            ortografia.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você pode reproduzir o áudio quantas vezes quiser antes de
            responder.
            <br />
            <br />
            - Sua resposta deve ser exatamente igual ao áudio, incluindo
            pontuação e acentos.
            <br />
            <br />
            - Letras maiúsculas e minúsculas são consideradas na correção.
            <br />
            <br />
            - Se errar, você poderá tentar novamente antes de avançar.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e escrita treinando diariamente.
          </p>

          <button className="start-button" onClick={comecarPratica}>
            Iniciar Prática de Listening & Writing
          </button>
        </div>
      )}
    </div>
  );
};

export default ListeningWritingComponent;
