import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ModalAuth from "../../Components/ModalAuth/ModalAuth";
import TalkingComponent from "../../Components/Pratica/Talking/TalkingComponent";
import "./Talking.css";

const Talking = () => {
  const [emConversacao, setEmConversacao] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      verificarAtivacao(user.uid);
    }
  }, [user]);

  const verificarAtivacao = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().hasActivated) {
        setIsActivated(true);
      } else {
        setModalOpen(true);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar ativação:", error);
    }
  };

  const comecarConversacao = () => {
    if (!isActivated) {
      alert("⚠️ Você precisa ativar sua conta antes de iniciar as atividades.");
      return;
    }
    setEmConversacao(true);
  };

  return (
    <div className="talking-page">
      <ModalAuth isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {!emConversacao ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você terá uma conversa em inglês com a IA.
            <br />
            <br />
            📜 Regras:
            <br />
            <br />- A IA responderá como um ser humano.
            <br />
            <br />- Você pode falar sobre qualquer assunto.
            <br />
            <br />- Use inglês para praticar vocabulário e fluência.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e fala treinando diariamente.
          </p>

          <button className="start-button" onClick={comecarConversacao}>
            Iniciar Prática de Conversa com a IA
          </button>
        </div>
      ) : (
        <TalkingComponent />
      )}
    </div>
  );
};

export default Talking;
