import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConteudoPratica from "./ConteudoPratica";
import "../../../global.css";
import "./ListeningWritingComponent.css";
import ProgressBar from "../ProgressBar";
import { auth } from "../../../firebaseConfig";
import TelaFinal from "../../TelaFinal/TelaFinalWriting";

const ListeningWritingComponent = () => {
  const [progresso, setProgresso] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [praticaConcluida, setPraticaConcluida] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const atualizarProgresso = () => {
    setProgresso((prev) => {
      const novo = Math.min(prev + 10, 100);
      if (novo === 100) finalizarPratica();
      return novo;
    });
  };

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

  const finalizarPratica = async () => {
    const pontos = acertos * 10;
    await salvarPontosEscrita(pontos);

    setTimeout(() => {
      navigate("/tela-final", { state: { pointsWriting: pontos } });
    }, 500);
  };

  return (
    <div className="listening-writing-container">
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
