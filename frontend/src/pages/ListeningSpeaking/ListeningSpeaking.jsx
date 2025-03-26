import React, { useState } from "react";
import ListeningSpeakingComponent from "../../Components/Pratica/ListeningSpeaking/ListeningSpeakingComponent";
import "./ListeningSpeaking.css";

const ListeningSpeaking = () => {
  const [praticando, setPraticando] = useState(false);

  return (
    <div className="listening-speaking-page">
      {!praticando ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            repeti-las corretamente para aprimorar sua pronúncia e compreensão
            auditiva.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você pode reproduzir o áudio quantas vezes quiser antes de
            repetir.
            <br />
            <br />
            - Sua resposta deve ser o mais próxima possível da frase original.
            <br />
            <br />
            - Pronúncia e entonação são avaliadas pela IA.
            <br />
            <br />
            - Se errar, você poderá tentar novamente antes de avançar.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e fala treinando diariamente.
          </p>

          <button className="start-button" onClick={() => setPraticando(true)}>
            Iniciar Prática de Listening & Speaking
          </button>
        </div>
      ) : (
        <ListeningSpeakingComponent />
      )}
    </div>
  );
};

export default ListeningSpeaking;
