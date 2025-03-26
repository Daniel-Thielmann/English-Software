import React, { useState, useEffect } from "react";

const TalkingComponent = ({ setPointsSpeaking }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isTalking) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => {
          if (prevTime >= 1800) {
            // 30 minutos
            setIsTalking(false);
            setPointsSpeaking(100);
            return prevTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isTalking, setPointsSpeaking]);

  const startTalking = () => {
    setIsTalking(true);
  };

  const stopTalking = () => {
    setIsTalking(false);
  };

  return (
    <div className="talking-container">
      <button onClick={startTalking} disabled={isTalking} className="start-btn">
        🎙️ {isTalking ? "Falando..." : "Iniciar Conversa"}
      </button>
      <button onClick={stopTalking} disabled={!isTalking} className="stop-btn">
        ⏹️ Parar
      </button>
      <p>
        Tempo falado: {Math.floor(elapsedTime / 60)} min {elapsedTime % 60} seg
      </p>
    </div>
  );
};

export default TalkingComponent;
