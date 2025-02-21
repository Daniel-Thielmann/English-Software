import React, { useEffect, useState } from "react";
import "./RankingComponent.css";

const RankingComponent = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/ranking")
      .then((response) => response.json())
      .then((data) => {
        setRanking(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar ranking:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking dos Melhores Usuários</h2>
      {loading ? (
        <p>Carregando ranking...</p>
      ) : (
        <ol>
          {ranking.map((user, index) => (
            <li key={user.id}>
              <strong>
                🥇 {index + 1}. {user.name}
              </strong>
              <br />
              🎙️ Pontos de Fala:{" "}
              {user.pointsSpeaking !== undefined
                ? user.pointsSpeaking
                : "Ainda não concluiu"}
              <br />
              ✍️ Pontos de Escrita:{" "}
              {user.pointsWriting !== undefined
                ? user.pointsWriting
                : "Ainda não concluiu"}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default RankingComponent;
