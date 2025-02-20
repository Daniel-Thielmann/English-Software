import codiicon from "../../assets/codi_icon.png";
import "./Header.css";

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
        <p>Aprimore seu entendimento em apenas alguns minutos, diariamente!</p>
        <p>
          No Listening & Writing, você ouvirá frases em inglês e precisará
          escrevê-las corretamente para aprimorar sua compreensão auditiva e
          ortografia. Já no Listening & Speaking, você praticará a pronúncia ao
          repetir frases, sendo avaliado por IA para melhorar sua fluência na
          fala.
        </p>
      </div>
    </header>
  );
};

export default Header;
