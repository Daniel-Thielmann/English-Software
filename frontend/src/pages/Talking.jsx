import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TalkingComponent from "../Components/Talking/TalkingComponent.jsx";
import "../Components/Talking/TalkingComponent.css";

const TalkingPage = () => {
  const [pointsSpeaking, setPointsSpeaking] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (pointsSpeaking >= 100) {
      setTimeout(() => {
        navigate("/tela-final", {
          state: { pointsSpeaking },
        });
      }, 500);
    }
  }, [pointsSpeaking, navigate]);

  return (
    <div className="talking-page">
      <h1>🗣️ Conversação com a IA</h1>
      <p>Fale com a IA por 30 minutos e ganhe 100 pontos!</p>
      <TalkingComponent setPointsSpeaking={setPointsSpeaking} />
      <p className="points-display">Pontos de Fala: {pointsSpeaking}</p>
    </div>
  );
};

export default TalkingPage;
