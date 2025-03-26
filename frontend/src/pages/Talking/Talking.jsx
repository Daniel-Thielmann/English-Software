import React, { useState } from "react";
import TalkingComponent from "../../Components/Pratica/Talking/TalkingComponent";
import "./Talking.css";

const Talking = () => {
  const [emConversacao, setEmConversacao] = useState(false);

  return (
    <div className="talking-page">
      {!emConversacao ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você terá uma conversa em inglês com a IA.
            <br />
            <br />
            📜 Regras:
            <br />- A IA responderá como um ser humano.
            <br />- Você pode falar sobre qualquer assunto.
            <br />- Use inglês para praticar vocabulário e fluência.
          </p>

          <button
            className="start-button"
            onClick={() => setEmConversacao(true)}
          >
            Iniciar Prática de Conversa com a IA
          </button>
        </div>
      ) : (
        <TalkingComponent />
      )}
    </div>
  );
};

export default Talking;
