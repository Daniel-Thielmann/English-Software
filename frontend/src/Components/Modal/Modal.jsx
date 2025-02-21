import React from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Importar navegação do React Router
import { auth } from "../../utils/firebaseConfig"; // 🔹 Importando autenticação
import "./Modal.css";

const Modal = ({
  message,
  onClose,
  finalizarPratica,
  acertos = 0,
  showDoneBtn,
}) => {
  const navigate = useNavigate(); // 🔹 Hook para navegação

  const handleFinalize = () => {
    const user = auth.currentUser; // 🔹 Obtendo usuário autenticado

    if (!user) {
      console.error("Usuário não autenticado!");
      return;
    }

    // 🔹 Atualiza os pontos do usuário no Firestore antes de navegar
    fetch("http://localhost:3000/api/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        points: acertos * 10, // 🔹 Cada acerto vale 10 pontos
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Pontos atualizados com sucesso:", data);

        // 🔹 Navega para a Tela Final passando os acertos
        navigate("/tela-final", { state: { acertos } });
      })
      .catch((error) => console.error("Erro ao atualizar pontos:", error));
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
            Ir para Tela Final
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
