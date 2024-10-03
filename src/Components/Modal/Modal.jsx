import React from 'react';
import './Modal.css';

const Modal = ({ message, onClose, finalizarPratica, acertos }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖️</button>
        <p>{message}</p>
        {feedback && <p className='feedback'></p>}

        {message.includes("limite de 10 áudios") && (
          <button className='btn-finalize' onClick={() => finalizarPratica(acertos)}>
            Ir para Tela Final
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;