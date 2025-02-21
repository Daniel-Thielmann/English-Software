import React from "react";
import { useLocation } from "react-router-dom";
import "./TelaFinal.css";

const TelaFinal = () => {
  const location = useLocation();
  const { pointsWriting = 0, pointsSpeaking = 0 } = location.state || {};

  return (
    <div className="container-final">
      <h1 className="header-final">🎉 Prática Concluída!</h1>
      <p className="sub-final">Volte amanhã para continuar evoluindo! 🚀</p>

      <p className="resultado-final">
        🗣️ Pontos de Fala:{" "}
        {pointsSpeaking > 0 ? pointsSpeaking : "Ainda não concluiu"}
      </p>

      <p className="resultado-final">
        ✍️ Pontos de Escrita:{" "}
        {pointsWriting > 0 ? pointsWriting : "Ainda não concluiu"}
      </p>

      <button
        className="btn-voltar"
        onClick={() => (window.location.href = "/")}
      >
        🔙 Voltar ao Início
      </button>
    </div>
  );
};

export default TelaFinal;
