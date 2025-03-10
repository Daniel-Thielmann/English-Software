import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import api from "../../utils/api"; // 🔹 Importando Axios
import "./Modal.css";

const ModalWriting = ({ message, onClose, acertos = 0, showDoneBtn }) => {
  const navigate = useNavigate();

  const handleFinalize = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    try {
      console.log(`🔹 Atualizando pontos de escrita:`, {
        userId: user.uid,
        pointsWriting: acertos * 10,
      });

      const response = await api.post("/points/update-writing-points", {
        userId: user.uid,
        pointsWriting: acertos * 10,
      });

      console.log("✅ Pontos de Escrita salvos com sucesso:", response.data);

      // 🔹 Navega para a Tela Final de Writing
      navigate("/tela-final-writing", {
        state: { pointsWriting: acertos * 10 },
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar pontos de escrita:", error.message);
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
            Ir para Tela Final de Escrita
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalWriting;
