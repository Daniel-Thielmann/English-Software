import React, { useState } from "react";
import "./ModalAuth.css";
import { auth } from "../../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";

const ModalAuth = ({ isOpen, onClose }) => {
  const [activationKey, setActivationKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activationKey.trim() === "") {
      setMessage("❌ Insira uma chave de ativação válida!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setMessage("❌ Você precisa estar logado para ativar sua conta!");
      return;
    }

    setLoading(true);
    setMessage("");

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

      let data = null;
      try {
        data = await response.json();
      } catch (err) {
        console.warn("⚠️ Resposta sem JSON válido.");
      }

      if (response.ok && data && data.success) {
        setMessage("✅ Sua conta foi ativada com sucesso!");
        setTimeout(() => {
          onClose();
          navigate(location.pathname).then(() => {
            window.location.reload();
          });
        }, 1500);
      } else if (data && data.message) {
        setMessage(`❌ ${data.message}`);
      } else {
        setMessage("❌ Chave inválida ou erro ao validar.");
      }
    } catch (error) {
      console.error("❌ Erro ao validar chave:", error);
      setMessage("❌ Erro ao validar chave. Verifique sua conexão.");
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
          <p
            className={`modal-message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
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
