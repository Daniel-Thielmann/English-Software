import Navbar from "./Components/Navbar/Navbar"
import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import BarraProgresso from "./Components/Pratica/BarraProgresso"
import ConteudoPratica from "./Components/Pratica/ConteudoPratica"
import './global.css'
import { useState } from "react"

const App = () => {
  const [praticando, setPraticando] = useState(false);

  const comecarPratica= () => {
    setPraticando(true);
  }

  return (
    <div className="App">
      <Navbar />
      <main className="container">
          {praticando ? (
          <div>
            <BarraProgresso />
            <ConteudoPratica />
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
/*
Para que outros componentes sejam renderizados quando o botão "Praticar agora!" for clicado, você pode usar o estado do React para controlar qual conteúdo deve ser exibido. Vou demonstrar como fazer isso passo a passo.

Primeiro, vamos adicionar o estado ao componente App e uma função para alternar entre os dois conjuntos de componentes. Em seguida, vamos modificar o botão no componente Header para chamar essa função ao ser clicado.
*/ 