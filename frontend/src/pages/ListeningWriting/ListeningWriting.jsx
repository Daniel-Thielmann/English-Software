import React, { useState } from "react";
import ListeningWritingComponent from "../../Components/Pratica/ListeningWriting/ListeningWritingComponent";
import "./ListeningWriting.css";

const ListeningWriting = () => {
  const [praticando, setPraticando] = useState(false);

  return (
    <div className="listening-writing-container">
      {!praticando ? (
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

          <button className="start-button" onClick={() => setPraticando(true)}>
            Iniciar Prática de Listening & Writing
          </button>
        </div>
      ) : (
        <ListeningWritingComponent />
      )}
    </div>
  );
};

export default ListeningWriting;
