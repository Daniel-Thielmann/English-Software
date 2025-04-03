import React, { useState } from "react";
import "./ModalAuth.css";
import { auth } from "../../firebaseConfig";

const ModalAuth = ({ isOpen, onClose, onSubmit }) => {
  const [activationKey, setActivationKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activationKey.trim() === "") {
      setMessage({ type: "error", text: "❌ Insira uma chave válida!" });
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setMessage({ type: "error", text: "❌ Você precisa estar logado!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await onSubmit(activationKey); // chama função do componente pai

      if (result?.success) {
        setMessage({
          type: "success",
          text: "✅ Sua conta foi ativada com sucesso!",
        });

        // Aguarda alguns segundos para redirecionar ou fechar
        setTimeout(() => {
          setActivationKey("");
          setMessage(null);
          onClose(); // fecha modal
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: result?.message || "❌ Erro ao validar chave.",
        });
      }
    } catch (error) {
      console.error("Erro ao validar chave:", error);
      setMessage({
        type: "error",
        text: "❌ Erro ao validar chave. Verifique sua conexão.",
      });
    } finally {
      setLoading(false);
    }
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

        {message && (
          <div className={`modal-message ${message.type}`}>{message.text}</div>
        )}

        <div className="modal-buttons">
          <button
            onClick={handleSubmit}
            className="btn-activate"
            disabled={loading}
          >
            {loading ? "Validando..." : "Ativar"}
          </button>
          <button onClick={onClose} className="btn-close" disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAuth;
