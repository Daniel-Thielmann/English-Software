import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import navlogo from "../../assets/nav-logo.png";
import "./Nav.css";

const Navbar = ({ voltarParaInicio }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div className="nav-container">
      <div className="left-container" onClick={voltarParaInicio}>
        <Link to="/">
          <img src={navlogo} alt="Logo" />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/listening-writing" className="nav-item">
          📖 Escuta & Escrita
        </Link>
        <Link to="/listening-speaking" className="nav-item">
          🎤 Escuta & Fala
        </Link>
        <Link to="/ranking" className="nav-item">
          🏆 Ranking
        </Link>
      </div>

      {user ? (
        <div className="right-container-logged">
          <span>{user.email}</span>
          <span className="material-symbols-outlined" onClick={handleLogout}>
            logout
          </span>
        </div>
      ) : (
        <button className="right-container" onClick={() => navigate("/auth")}>
          Entrar / Criar Conta
        </button>
      )}
    </div>
  );
};

export default Navbar;
