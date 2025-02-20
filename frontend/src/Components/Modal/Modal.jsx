import React from "react";
import "./Modal.css";

const Modal = ({
  message,
  onClose,
  finalizarPratica,
  acertos,
  showDoneBtn,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖️
        </button>
        <p className="modal-text">{message}</p>
        {showDoneBtn && (
          <button
            className="btn-finalize"
            onClick={() => finalizarPratica(acertos)}
          >
            Ir para Tela Final
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
