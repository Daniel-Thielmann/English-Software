import React, { useState, useEffect } from "react";
import ModalAuth from "../../Components/ModalAuth/ModalAuth";
import TalkingComponent from "../../Components/Pratica/Talking/TalkingComponent";
import "./Talking.css";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Talking = () => {
  const [emConversacao, setEmConversacao] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pointsSpeaking, setPointsSpeaking] = useState(0);
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    const verificarAtivacao = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().hasActivated) {
          setIsActivated(true);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar ativação:", error);
      }
    };

    verificarAtivacao();
  }, [user]);

  const handleStartClick = () => {
    if (isActivated) {
      setEmConversacao(true);
    } else {
      setModalOpen(true);
    }
  };

  const validarChaveDeAtivacao = async (activationKey) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/validate-key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, activationKey }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsActivated(true);
        setModalOpen(false);
        setEmConversacao(true); // ✅ já entra na prática
      } else {
        alert(data.message || "Erro ao validar a chave.");
      }
    } catch (error) {
      console.error("❌ Erro ao validar chave:", error);
      alert("❌ Erro ao validar chave. Verifique sua conexão.");
    }
  };

  const finalizarPratica = () => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        pointsSpeaking,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/tela-final", {
          state: {
            pointsSpeaking,
          },
        });
      })
      .catch((err) => {
        console.error("Erro ao salvar pontos:", err);
        alert("❌ Erro ao salvar sua pontuação.");
      });
  };

  return (
    <div className="talking-page">
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={validarChaveDeAtivacao}
      />

      {!emConversacao ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você terá uma conversa em inglês com a IA por
            até 30 minutos.
            <br />
            <br />
            📜 Regras:
            <br />- Fale sobre qualquer assunto.
            <br />- A IA responde por voz.
            <br />- Você ganhará pontos ao longo da conversa.
          </p>
          <button className="start-button" onClick={handleStartClick}>
            Iniciar Conversa com a IA
          </button>
        </div>
      ) : (
        <TalkingComponent
          setPointsSpeaking={setPointsSpeaking}
          finalizarPratica={finalizarPratica}
        />
      )}
    </div>
  );
};

export default Talking;
