import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConteudoPratica from "./ConteudoPratica";
import "../../../global.css";
import "./ListeningWritingComponent.css";
import ProgressBar from "../ProgressBar";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ModalAuth from "../../ModalAuth/ModalAuth";
import TelaFinal from "../../TelaFinal/TelaFinalWriting";

const ListeningWritingComponent = () => {
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

  // Verifica se a conta está ativada
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

  // Valida chave de ativação
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

  // Atualiza progresso
  const atualizarProgresso = () => {
    setProgresso((prev) => {
      const novo = Math.min(prev + 10, 100);
      if (novo === 100) finalizarPratica();
      return novo;
    });
  };

  // Envia pontos de escrita para o backend
  const salvarPontosEscrita = async (pontos) => {
    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-writing-points`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, pointsWriting: pontos }),
        }
      );

      const data = await response.json();
      console.log("✅ Pontos de Escrita salvos no backend:", data);
    } catch (error) {
      console.error("❌ Erro ao salvar pontos:", error);
    }
  };

  // Finaliza a prática
  const finalizarPratica = async () => {
    const pontos = acertos * 10;
    await salvarPontosEscrita(pontos);

    setTimeout(() => {
      navigate("/tela-final", { state: { pointsWriting: pontos } });
    }, 500);
  };

  return (
    <div className="listening-writing-container">
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => setIsActivated(true)}
      />

      {praticaConcluida ? (
        <div className="final-screen">
          <TelaFinal
            pointsWriting={acertos * 10}
            progresso={progresso}
            voltarParaInicio={() => {}}
          />
          <p className="final-message">Parabéns! Você concluiu a prática.</p>
        </div>
      ) : (
        <div className="practice-content">
          <ProgressBar progresso={progresso} />
          <ConteudoPratica
            setProgresso={atualizarProgresso}
            setAcertos={setAcertos}
            finalizarPratica={finalizarPratica}
          />
        </div>
      )}
    </div>
  );
};

export default ListeningWritingComponent;
