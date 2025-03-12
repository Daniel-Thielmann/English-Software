import codiicon from "../../assets/codi_icon.png";
import "./Header.css";
import React from "react";

const Header = ({ comecarPratica }) => {
  return (
    <header className="header-container">
      <div className="logo">
        <img src={codiicon} alt="Logomarca Codi Academy" />
      </div>
      <div className="header-text">
        <h1>
          A <span>nova maneira</span> de aprender inglês
        </h1>
        <p>
          Aprimore seu entendimento em apenas alguns minutos! Com auxilio
          completo da melhor tecnologia de Inteligência Artificial
        </p>
        <p>
          No Listening & Writing, você ouvirá frases em inglês geradas por IA e
          precisará escrevê-las corretamente para aprimorar sua compreensão
          auditiva e ortografia.
          <br></br>
          <br></br>
          Já no Listening & Speaking, você praticará a pronúncia ao repetir
          frases geradas por IA, sendo avaliado por IA para melhorar sua
          fluência na fala.
          <br></br>
          <br></br>
          Com a Conversação IA, você poderá conversar livremente com a
          inteligência artificial, praticando a comunicação em tempo real. Fale
          por 30 minutos e ganhe 100 pontos para aprimorar ainda mais suas
          habilidades no idioma e subir no Ranking!
        </p>
      </div>
    </header>
  );
};

export default Header;
