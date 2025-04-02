import React, { useState } from "react";
import ModalAuth from "../../ModalAuth/ModalAuth";
import { auth, db } from "../../../firebaseConfig";

const PraticaButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkActivation = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("❌ Você precisa estar logado para fazer as práticas.");
      return;
    }

    setLoading(true);

    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      const data = userDoc.data();

      if (data && data.hasActivated) {
        // ✅ Conta já ativada → redireciona para a prática atual
        window.location.href = window.location.pathname;
      } else {
        // ❌ Conta não ativada → abre modal
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar ativação:", error);
      alert("❌ Erro ao verificar ativação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={checkActivation} disabled={loading}>
        {loading ? "Verificando..." : "Iniciar Prática"}
      </button>
      <ModalAuth isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PraticaButton;
