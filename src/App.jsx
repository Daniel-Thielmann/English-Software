import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import BarraProgresso from "./Components/Pratica/BarraProgresso";
import ConteudoPratica from "./Components/Pratica/ConteudoPratica";
import './global.css';

const App = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const comecarPratica = () => {
    setPraticando(true);
  };

  const voltarParaInicio = () => {
    setPraticando(false);
    setProgresso(0); // Zera o progresso
  };

  // Permite definir o progresso diretamente
  const setProgressoDireto = (novoProgresso) => {
    setProgresso(novoProgresso);
  };

  return (
    <div className="App">
      <Navbar voltarParaInicio={voltarParaInicio} />
      <main className="container">
        {praticando ? (
          <div>
            <BarraProgresso progresso={progresso} />
            <ConteudoPratica setProgresso={setProgressoDireto} />
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
