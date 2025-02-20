import React, { useState } from "react";
import "./ConteudoFala.css";

const ConteudoFala = ({ setProgresso }) => {
  const [gravando, setGravando] = useState(false);
  const [resultado, setResultado] = useState("");
  const [feedback, setFeedback] = useState("");

  const iniciarGravacao = () => {
    setGravando(true);
    setFeedback("Gravando... Fale agora!");
    // Simulando a captura de áudio
    setTimeout(() => {
      processarFala("Hello world"); // Simula reconhecimento de fala
    }, 3000);
  };

  const processarFala = (falaReconhecida) => {
    setGravando(false);
    setResultado(falaReconhecida);

    // Simulação de correção da IA
    const respostaCorreta = "Hello world"; // Frase esperada
    if (falaReconhecida.toLowerCase() === respostaCorreta.toLowerCase()) {
      setFeedback("✅ Ótimo! Pronúncia correta.");
      setProgresso((prev) => Math.min(prev + 10, 100)); // Aumenta o progresso
    } else {
      setFeedback("❌ Tente novamente! Pronúncia incorreta.");
    }
  };

  return (
    <div className="conteudo-fala-container">
      <h3>Repita a frase:</h3>
      <p className="frase">"Hello world"</p>

      <button
        className="botao-falar"
        onClick={iniciarGravacao}
        disabled={gravando}
      >
        {gravando ? "Gravando..." : "Falar Agora 🎤"}
      </button>

      {resultado && <p className="resultado">Você disse: "{resultado}"</p>}
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default ConteudoFala;
