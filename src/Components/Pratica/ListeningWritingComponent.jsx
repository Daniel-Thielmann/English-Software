import React, { useState } from "react";
import ConteudoPratica from "./ConteudoPratica";
import TelaFinal from "./TelaFinal";
import "../../global.css";
import "./ListeningWritingComponent.css"; // Importando o CSS
import ProgressBar from "./ProgressBar";

const ListeningWritingComponent = () => {
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
      console.log("Novo progresso:", novoValor); // Teste no Console (F12 > Console)
      return novoValor;
    });
  };

  return (
    <div className="listening-writing-container">
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
          <ConteudoPratica setProgresso={atualizarProgresso} />
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
