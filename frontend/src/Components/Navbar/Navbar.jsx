import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../utils/firebaseConfig";
import navlogo from "../../assets/nav-logo.png";
import "./Nav.css";

const Navbar = ({ voltarParaInicio }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const loggedUser = result.user;
        setUser(loggedUser);

        fetch("http://localhost:3000/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: loggedUser.uid,
            name: loggedUser.displayName,
            email: loggedUser.email,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro do backend: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Usuário salvo no backend:", data);
          })
          .catch((error) => {
            console.error("Erro ao salvar usuário:", error);
            setError("Erro ao salvar usuário no backend.");
          })
          .finally(() => setLoading(false));
      })
      .catch((e) => {
        console.error("Erro ao autenticar com o Google:", e);
        alert("Falha na autenticação com Google. Verifique as configurações!");
        setError("Erro ao autenticar com o Google.");
        setLoading(false);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Erro ao deslogar:", error);
        setError("Erro ao deslogar.");
      });
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
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="user-photo"
          />
          <span>{user.displayName}</span>
          <span
            className="material-symbols-outlined"
            onClick={handleLogout}
            id="logout"
          >
            logout
          </span>
        </div>
      ) : (
        <button
          className="right-container"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Login com Google"}
        </button>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Navbar;
