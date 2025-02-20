import "./BarraProgresso.css";

const BarraProgresso = ({ progresso }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progresso}%`, // ✅ Agora deve expandir corretamente
            height: "100%", // ✅ Garante altura correta
          }}
        ></div>
      </div>
      <p className="progress-text">Progresso: {progresso}%</p>
    </div>
  );
};

export default BarraProgresso;
