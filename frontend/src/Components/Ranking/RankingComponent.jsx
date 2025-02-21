import React, { useEffect, useState } from "react";
import "./RankingComponent.css"; // 🔹 Importa o CSS

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

  // Define as medalhas para os 3 primeiros colocados 🏅
  const getMedal = (index) => {
    if (index === 0) return <span className="ranking-medal gold">🥇</span>;
    if (index === 1) return <span className="ranking-medal silver">🥈</span>;
    if (index === 2) return <span className="ranking-medal bronze">🥉</span>;
    return <span className="ranking-medal">{index + 1}.</span>;
  };

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking dos Melhores Usuários</h2>
      {loading ? (
        <p>Carregando ranking...</p>
      ) : (
        <ul className="ranking-list">
          {ranking.map((user, index) => (
            <li key={user.id}>
              {getMedal(index)}
              <span>{user.name}</span>
              <span>{user.points} pontos</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RankingComponent;
