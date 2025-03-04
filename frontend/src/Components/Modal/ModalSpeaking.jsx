import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import "./Modal.css";

const ModalSpeaking = ({ message, onClose, acertos = 0, showDoneBtn }) => {
  const navigate = useNavigate();

  const handleFinalize = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    const apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/points/update-speaking-points`;

    try {
      console.log(`🔹 Atualizando pontos de fala:`, {
        userId: user.uid,
        pointsSpeaking: acertos * 10,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          pointsSpeaking: acertos * 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Pontos de Fala salvos com sucesso:", data);

      // 🔹 Navega para a Tela Final de Speaking
      navigate("/tela-final-speaking", {
        state: { pointsSpeaking: acertos * 10 },
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar pontos de fala:", error);
      alert("Erro ao salvar os pontos. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖️
        </button>
        <p className="modal-text">{message}</p>
        {showDoneBtn && (
          <button className="btn-finalize" onClick={handleFinalize}>
            Ir para Tela Final de Fala
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalSpeaking;
