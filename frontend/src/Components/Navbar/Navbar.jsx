import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import navlogo from "../../assets/nav-logo.png";
import "./Nav.css";
import React from "react";

const Navbar = ({ voltarParaInicio }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

      <div className="center-container">
        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          <Link
            to="/listening-writing"
            className="nav-item"
            onClick={() => setMenuOpen(false)}
          >
            📖 Escuta & Escrita
          </Link>
          <Link
            to="/listening-speaking"
            className="nav-item"
            onClick={() => setMenuOpen(false)}
          >
            🎤 Escuta & Fala
          </Link>
          <Link to="/talking" className="nav-item">
            🗣️ Conversação IA
          </Link>
          <Link
            to="/ranking"
            className="nav-item"
            onClick={() => setMenuOpen(false)}
          >
            🏆 Ranking
          </Link>

          {!user && (
            <button
              className="mobile-login-btn"
              onClick={() => {
                navigate("/auth");
                setMenuOpen(false);
              }}
            >
              Entrar / Criar Conta
            </button>
          )}
        </div>
      </div>

      <div className="right-container">
        {user ? (
          <div className="right-container-logged">
            <span>{user.email}</span>
            <span className="material-symbols-outlined" onClick={handleLogout}>
              logout
            </span>
          </div>
        ) : (
          <button
            className="desktop-login-btn"
            onClick={() => navigate("/auth")}
          >
            Entrar / Criar Conta
          </button>
        )}

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>
    </div>
  );
};

export default Navbar;
