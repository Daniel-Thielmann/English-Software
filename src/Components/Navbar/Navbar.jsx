import navlogo from '../../assets/nav-logo.png'
import './Nav.css'


const Navbar = ({ voltarParaInicio }) => {
  return (
    <div className="nav-container">
        <div className="left-container" onClick={voltarParaInicio}>
            <img src={navlogo} alt="" />
        </div>
        <div className="right-container">
            Checar Ranking
        </div>
    </div>
  )
}

export default Navbar