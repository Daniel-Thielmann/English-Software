import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ModalAuth from "../../Components/ModalAuth/ModalAuth";
import ListeningWritingComponent from "../../Components/Pratica/ListeningWriting/ListeningWritingComponent";
import "./ListeningWriting.css";

const ListeningWriting = () => {
  const [praticando, setPraticando] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  const verificarAtivacao = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsActivated(data.hasActivated || false);
        }
      } catch (err) {
        console.error("Erro ao verificar ativação:", err);
      }
    }
    setCarregandoUsuario(false);
  };

  useEffect(() => {
    verificarAtivacao();
  }, []);

  const iniciarPratica = () => {
    if (isActivated) {
      setPraticando(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleAtivacaoConcluida = async () => {
    setModalOpen(false);
    await verificarAtivacao();
    setPraticando(true);
  };

  if (carregandoUsuario) {
    return <div className="loading">Carregando dados do usuário...</div>;
  }

  return (
    <div className="listening-writing-container">
      <ModalAuth
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAtivacaoConcluida}
      />

      {!praticando ? (
        <div className="start-section">
          <p className="body-text">
            🔹 Nesta atividade, você ouvirá frases em inglês e precisará
            digitá-las corretamente para aprimorar sua compreensão auditiva e
            ortografia.
            <br />
            <br />
            📜 Regras da Atividade:
            <br />
            <br />
            - Você pode reproduzir o áudio quantas vezes quiser antes de
            responder.
            <br />
            <br />
            - Sua resposta deve ser exatamente igual ao áudio.
            <br />
            <br />
            - Se errar, você poderá tentar novamente antes de avançar.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e escrita treinando diariamente.
          </p>

          <button className="start-button" onClick={iniciarPratica}>
            Iniciar Prática de Listening & Writing
          </button>
        </div>
      ) : (
        <ListeningWritingComponent />
      )}
    </div>
  );
};

export default ListeningWriting;
