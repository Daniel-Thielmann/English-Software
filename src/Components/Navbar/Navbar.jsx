import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../utils/firebaseConfig";
import navlogo from '../../assets/nav-logo.png'
import './Nav.css'

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
        <img src={navlogo} alt="" />
      </div>
      {
        user ? (
          <div className="right-container-logged">
            <img src={user.photoURL} alt={user.displayName} className="user-photo" />
            <span>{user.displayName}</span>
            <button className="right-container">Checar Rankinkg</button>
            <button className="right-container" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="right-container" onClick={handleLogin}>
            Login com Google
          </div>
        )
      }
    </div>
  )
}

export default Navbar