import React, { useState } from "react";
import "./ModalAuth.css";

const ModalAuth = ({ isOpen, onClose, onSubmit }) => {
  const [activationKey, setActivationKey] = useState("");

  if (!isOpen) return null; // Se não estiver aberto, não renderiza o modal

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activationKey.trim() === "") {
      alert("❌ Insira uma chave de ativação válida!");
      return;
    }
    onSubmit(activationKey);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🔑 Ativação Necessária</h2>
        <p>Insira sua chave de ativação da Codi Academy para continuar.</p>
        <input
          type="text"
          placeholder="Digite a chave..."
          value={activationKey}
          onChange={(e) => setActivationKey(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="btn-activate">
            Ativar
          </button>
          <button onClick={onClose} className="btn-close">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAuth;
