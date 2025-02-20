import React from "react";
import "./ProgressBar.css"; // Importando o CSS

const ProgressBar = ({ progresso }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progresso}%` }} // Atualiza dinamicamente
        ></div>
      </div>
      <p className="progress-text">Progresso: {progresso}% / 100%</p>
    </div>
  );
};

export default ProgressBar;
