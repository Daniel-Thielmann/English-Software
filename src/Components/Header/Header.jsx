import logo from '../../assets/logo.png'
import codiicon from '../../assets/codi_icon.png'
import './Header.css'


const Header = () => {
  return (
    <div className="header-container">
        <div className="logo">
            <img src={codiicon} alt="Logomarca Codi Academy" />
        </div>
        <div className="header-text">
            <h1>A <span>nova maneira</span> de aprender inglês</h1>
            <p>Aprimore seu entendimento em apenas alguns minutos, diariamente!</p>
        </div>
        <div className="start-container">
            <button className="btn-start">
                Praticar agora!
            </button>
        </div>
    </div>
  )
}

export default Header