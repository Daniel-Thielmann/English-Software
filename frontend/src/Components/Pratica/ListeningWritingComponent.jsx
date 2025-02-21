import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Correção: Importando navigate
import ConteudoPratica from "./ConteudoPratica";
import TelaFinal from "./TelaFinal";
import "../../global.css";
import "./ListeningWritingComponent.css";
import ProgressBar from "./ProgressBar";
import { auth } from "../../firebaseConfig"; // 🔹 Correção: Importando corretamente

const ListeningWritingComponent = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [praticaConcluida, setPraticaConcluida] = useState(false);
  const navigate = useNavigate(); // 🔹 Correção: Adicionando useNavigate
  const user = auth.currentUser; // 🔹 Obtendo usuário autenticado

  const comecarPratica = () => {
    setPraticando(true);
    setPraticaConcluida(false);
    setProgresso(0);
    setAcertos(0);
  };

  const atualizarProgresso = () => {
    setProgresso((prevProgresso) => {
      const novoValor = Math.min(prevProgresso + 10, 100);
      console.log("Novo progresso:", novoValor); // Teste no Console

      if (novoValor === 100) {
        finalizarPratica();
      }

      return novoValor;
    });
  };

  const finalizarPratica = () => {
    if (!user) {
      console.error("❌ Usuário não autenticado!");
      return;
    }

    const pontos = acertos * 10;

    console.log("🔹 Enviando para o backend:", {
      userId: user.uid,
      pointsWriting: pontos,
    });

    fetch("http://localhost:3000/api/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        pointsWriting: pontos, // 🔹 Garantindo que pointsWriting é enviado
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Pontos de Escrita atualizados:", data);
        setTimeout(() => {
          navigate("/tela-final", {
            state: { pointsWriting: pontos },
          });
        }, 500);
      })
      .catch((error) => console.error("❌ Erro ao atualizar pontos:", error));
  };

  return (
    <div className="listening-writing-container">
      {praticaConcluida ? (
        <div className="final-screen">
          <TelaFinal
            pointsWriting={acertos * 10}
            progresso={progresso}
            voltarParaInicio={() => setPraticando(false)}
          />
          <p className="final-message">Parabéns! Você concluiu a prática.</p>
        </div>
      ) : praticando ? (
        <div className="practice-content">
          <ProgressBar progresso={progresso} />
          <ConteudoPratica
            setProgresso={atualizarProgresso}
            setAcertos={setAcertos}
          />
        </div>
      ) : (
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
            - Sua resposta deve ser exatamente igual ao áudio, incluindo
            pontuação e acentos.
            <br />
            <br />
            - Letras maiúsculas e minúsculas são consideradas na correção.
            <br />
            <br />
            - Se errar, você poderá tentar novamente antes de avançar.
            <br />
            <br />
            🎯 Objetivo: Melhore sua escuta e escrita treinando diariamente.
          </p>

          <button className="start-button" onClick={comecarPratica}>
            Iniciar Prática de Listening & Writing
          </button>
        </div>
      )}
    </div>
  );
};

export default ListeningWritingComponent;
