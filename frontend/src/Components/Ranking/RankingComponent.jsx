import React, { useEffect, useState } from "react";
import "./RankingComponent.css";

const RankingComponent = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch("http://localhost:3000/points/ranking");
        if (!response.ok) {
          throw new Error("Erro ao buscar ranking");
        }
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        console.error("❌ Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking dos Melhores Usuários</h2>
      {loading ? (
        <p>Carregando ranking...</p>
      ) : ranking.length === 0 ? (
        <p>Nenhum usuário no ranking ainda.</p>
      ) : (
        <ol className="ranking-list">
          {ranking.map((user, index) => (
            <li key={user.id} className={`rank-${index + 1}`}>
              <span
                className={`ranking-medal ${
                  index === 0
                    ? "gold"
                    : index === 1
                    ? "silver"
                    : index === 2
                    ? "bronze"
                    : "default"
                }`}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : "🏅"}{" "}
                {index + 1}.
              </span>
              <span className="user-name">{user.name}</span>
              <span className="points">
                🎙️ {user.pointsSpeaking} | ✍️ {user.pointsWriting} | 🏆 Total:{" "}
                {user.totalPoints}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default RankingComponent;
