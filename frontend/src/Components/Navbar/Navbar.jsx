import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link para navegação
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../utils/firebaseConfig";
import navlogo from "../../assets/nav-logo.png";
import "./Nav.css";

const Navbar = ({ voltarParaInicio }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);

        // Enviar os dados do usuário para o backend
        fetch("http://localhost:3000/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Usuário salvo no backend:", data))
          .catch((error) => console.error("Erro ao salvar usuário:", error));

        window.location.reload();
      })
      .catch((e) => {
        console.log("Erro ao logar: ", e);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="nav-container">
      <div className="left-container" onClick={voltarParaInicio}>
        <Link to="/">
          <img src={navlogo} alt="Logo" />
        </Link>
      </div>

      {/* Adicionando os Links para as Rotas */}
      <div className="nav-links">
        <Link to="/listening-writing" className="nav-item">
          📖 Escuta & Escrita
        </Link>
        <Link to="/listening-speaking" className="nav-item">
          🎤 Escuta & Fala
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
        <div className="right-container" onClick={handleLogin}>
          Login com Google
        </div>
      )}
    </div>
  );
};

export default Navbar;
