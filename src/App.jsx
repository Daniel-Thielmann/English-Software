import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import BarraProgresso from "./Components/Pratica/BarraProgresso";
import ConteudoPratica from "./Components/Pratica/ConteudoPratica";
import TelaFinal from "./Components/Pratica/TelaFinal";
import "./global.css";

const App = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [praticaConcluida, setPraticaConcluida] = useState(false);

  const comecarPratica = () => {
    setPraticando(true);
    setPraticaConcluida(false);
    setProgresso(0);
  };

  const finalizarPratica = (acertos) => {
    setAcertos(acertos);
    setPraticaConcluida(true);
  };

  const voltarParaInicio = () => {
    setPraticando(false);
    setProgresso(0);
    setAcertos(0);
    setPraticaConcluida(false);
  };

  const atualizarProgresso = (novoProgresso) => {
    const progressoAtualizado = Math.min(novoProgresso, 100);

    setProgresso(progressoAtualizado);

    if (progressoAtualizado === 100) {
      setPraticaConcluida(true);
      setPraticando(false);
    }
  };

  const atualizarAcertos = (novoAcerto) => {
    setAcertos((prevAcertos) => prevAcertos + (novoAcerto ? 1 : 0));
  };

  return (
    <div className="App">
      <Navbar voltarParaInicio={voltarParaInicio} />
      <main className="container">
        {praticaConcluida ? (
          <TelaFinal
            acertos={acertos}
            progresso={progresso}
            voltarParaInicio={voltarParaInicio}
          />
        ) : praticando ? (
          <div>
            <BarraProgresso progresso={progresso} />
            <ConteudoPratica
              setProgresso={atualizarProgresso}
              setAcertos={atualizarAcertos}
              finalizarPratica={finalizarPratica}
            />
          </div>
        ) : (
          <Header comecarPratica={comecarPratica} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
