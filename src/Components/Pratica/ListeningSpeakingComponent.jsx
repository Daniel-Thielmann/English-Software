import React, { useState } from "react";
import ConteudoFala from "./ConteudoFala"; // Componente específico para fala
import TelaFinal from "./TelaFinal";
import "../../global.css";
import "./ListeningSpeakingComponent.css"; // Importando o CSS
import ProgressBar from "./ProgressBar";

const ListeningSpeakingComponent = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [praticaConcluida, setPraticaConcluida] = useState(false);

  const comecarPratica = () => {
    setPraticando(true);
    setPraticaConcluida(false);
    setProgresso(0);
  };

  const atualizarProgresso = () => {
    setProgresso((prevProgresso) => {
      const novoValor = Math.min(prevProgresso + 10, 100);
      console.log("Novo progresso:", novoValor); // Debug no console
      return novoValor;
    });
  };

  return (
    <div className="listening-speaking-container">
      {praticaConcluida ? (
        <div className="final-screen">
          <TelaFinal
            acertos={acertos}
            progresso={progresso}
            voltarParaInicio={() => setPraticando(false)}
          />
          <p className="final-message">Parabéns! Você concluiu a prática.</p>
        </div>
      ) : praticando ? (
        <div className="practice-content">
          <ProgressBar progresso={progresso} />
          <ConteudoFala setProgresso={atualizarProgresso} />
        </div>
      ) : (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            repeti-las corretamente para aprimorar sua pronúncia e fluência.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você deve repetir a frase com a melhor pronúncia possível.
            <br />
            <br />
            - Um sistema de IA analisará sua voz e dará uma pontuação.
            <br />
            <br />
            - Você pode tentar novamente se não estiver satisfeito com a
            resposta.
            <br />
            <br />
            - A cada acerto, sua barra de progresso aumentará.
            <br />
            <br />
            🎯 Objetivo: Melhore sua pronúncia praticando regularmente!
          </p>
          <button className="start-button" onClick={comecarPratica}>
            Iniciar Prática de Listening & Speaking
          </button>
        </div>
      )}
    </div>
  );
};

export default ListeningSpeakingComponent;
