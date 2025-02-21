import { useLocation } from "react-router-dom";
import "./TelaFinal.css";

const TelaFinal = () => {
  const location = useLocation();
  const pointsWriting = location.state?.pointsWriting ?? "Ainda não concluiu";
  const pointsSpeaking = location.state?.pointsSpeaking ?? "Ainda não concluiu";

  console.log("📌 Tela Final - pontosWriting:", pointsWriting);
  console.log("📌 Tela Final - pontosSpeaking:", pointsSpeaking);

  return (
    <div className="container-final">
      <h1>🎉 Prática Concluída!</h1>
      <p>Volte amanhã para continuar evoluindo! 🚀</p>

      <p>🗣️ Pontos de Fala: {pointsSpeaking}</p>
      <p>✍️ Pontos de Escrita: {pointsWriting}</p>

      <button onClick={() => navigate("/")}>Voltar ao Início</button>
    </div>
  );
};

export default TelaFinal;
