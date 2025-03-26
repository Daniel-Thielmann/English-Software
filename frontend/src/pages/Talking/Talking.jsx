import React, { useState } from "react";
import "./Talking.css";

const Talking = () => {
  const [emConversacao, setEmConversacao] = useState(false);

  return (
    <div className="talking-page">
      {!emConversacao ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você terá uma conversa em inglês com a IA. A IA
            fará perguntas e comentários como em uma conversa real.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você pode responder por voz ou por texto.
            <br />
            <br />
            - A IA avaliará a coerência, vocabulário e fluidez.
            <br />
            <br />
            - Caso não entenda, você pode pedir para repetir ou simplificar.
            <br />
            <br />
            🎯 Objetivo: Praticar conversação real com contexto e fluidez.
          </p>

          <button
            className="start-button"
            onClick={() => setEmConversacao(true)}
          >
            Iniciar Conversa com a IA
          </button>
        </div>
      ) : (
        <div className="em-breve">
          <h2>🛠️ Em breve...</h2>
          <p>A funcionalidade de conversação está em desenvolvimento.</p>
        </div>
      )}
    </div>
  );
};

export default Talking;
