import Navbar from "./Components/Navbar/Navbar"
import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import BarraProgresso from "./Components/Pratica/BarraProgresso"
import ConteudoPratica from "./Components/Pratica/ConteudoPratica"
import './global.css'
import { useState } from "react"

const App = () => {
  const [praticando, setPraticando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const comecarPratica= () => {
    setPraticando(true);
  }

  const voltarParaInicio = () => {
    setPraticando(false);
    setProgresso(0);
  }

  const aumentarProgresso = () => {
    setProgresso((prevProgresso) => Math.min(prevProgresso + 10, 100));
  }

  return (
    <div className="App">
      <Navbar voltarParaInicio={voltarParaInicio}/>
      <main className="container">
          {praticando ? (
          <div>
            <BarraProgresso progresso={progresso}/>
            <ConteudoPratica aumentarProgresso={aumentarProgresso}/>
          </div>
        ) : (
          <Header comecarPratica={comecarPratica}/>
        ) }
      </main>
      <Footer />
    </div>
  )
}

export default App
