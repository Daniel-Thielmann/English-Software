import navlogo from '../../assets/nav-logo.png'
import './Nav.css'


const Navbar = () => {
  return (
    <div className="nav-container">
        <div className="left-container">
            <img src={navlogo} alt="" />
        </div>
        <div className="right-container">
            Checar Ranking
        </div>
    </div>
  )
}

export default Navbar