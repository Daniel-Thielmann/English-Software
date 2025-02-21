import { useLocation } from "react-router-dom";
import "./TelaFinal.css";

const TelaFinal = () => {
  const location = useLocation();
  const { pointsWriting, pointsSpeaking } = location.state || {};

  return (
    <div className="container-final">
      <h1 className="header-final">🎉 Prática Concluída!</h1>
      <p className="sub-final">Volte amanhã para continuar evoluindo! 🚀</p>

      <div className="pontuacoes">
        <p className="pontuacao-final">
          🎙️ Pontos de Fala:{" "}
          {pointsSpeaking !== undefined ? pointsSpeaking : "Ainda não concluiu"}
        </p>
        <p className="pontuacao-final">
          ✍️ Pontos de Escrita:{" "}
          {pointsWriting !== undefined ? pointsWriting : "Ainda não concluiu"}
        </p>
      </div>
    </div>
  );
};

export default TelaFinal;
