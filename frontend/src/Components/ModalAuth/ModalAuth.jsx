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
      setMessage({ type: "error", text: "Insira uma chave válida!" });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setMessage({ type: "error", text: "Você precisa estar logado!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/validate-key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            activationKey: activationKey,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "✅ Sua conta foi ativada com sucesso!",
        });

        // ⬇️ Chama o callback sem `.then`
        if (typeof onSubmit === "function") {
          onSubmit(); // o fluxo continua no componente pai
        }
      } else {
        setMessage({
          type: "error",
          text: "❌ Chave inválida ou não autenticada ainda.",
        });
      }
    } catch (error) {
      console.error("❌ Erro ao validar chave:", error);
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
