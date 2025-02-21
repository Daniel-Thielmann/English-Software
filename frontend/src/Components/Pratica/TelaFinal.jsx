import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TelaFinal.css";

const TelaFinal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Captura os valores passados na navegação ou assume padrão
  const { acertos = 0, progresso = 0 } = location.state || {};

  // Define mensagem motivacional
  const getMotivationalMessage = () => {
    if (acertos === 10) return "Perfeito! Você acertou todas! 🎯🔥";
    if (acertos >= 7) return "Ótimo trabalho! Continue praticando. 💪";
    if (acertos >= 5) return "Bom esforço! Tente melhorar amanhã. 🚀";
    return "Não desista! Amanhã será melhor. 💡";
  };

  return (
    <div className="container-final">
      <h1 className="header-final">🎉 Prática Concluída!</h1>
      <p className="sub-final">Volte amanhã para continuar evoluindo! 🚀</p>

      <p className="motivational-message">{getMotivationalMessage()}</p>

      {/* Barra de progresso animada */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progresso}%` }}>
          {progresso}%
        </div>
      </div>

      <p className="acertos-final">
        <span>✅ Acertos:</span> {acertos} de 10
      </p>

      {/* Botões */}
      <div className="button-group">
        <button className="btn-voltar" onClick={() => navigate("/")}>
          🔙 Voltar ao Início
        </button>
        <button className="btn-ranking" onClick={() => navigate("/ranking")}>
          🏆 Ver Ranking
        </button>
      </div>
    </div>
  );
};

export default TelaFinal;
