import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, provider } from "../../utils/firebaseConfig";
import "./AuthPage.css";
import api from "../../utils/api";

const AuthPage = () => {
  const [name, setName] = useState(""); // 🔹 Adicionando nome
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Função para registrar usuário no Firestore
  const registerUserInDatabase = async (user, displayName) => {
    try {
      console.log("📡 Enviando usuário para o backend:", {
        uid: user.uid,
        email: user.email,
        name: displayName || "Usuário",
      });

      const response = await api.post("/users/create-user", {
        uid: user.uid,
        email: user.email,
        name: displayName || "Usuário",
      });

      console.log("✅ Resposta do backend:", response.data);
    } catch (err) {
      console.error(
        "❌ Erro ao salvar usuário no banco de dados:",
        err.message
      );
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("📡 Tentando criar usuário no Firebase com:", {
        email,
        password,
      });

      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("✅ Usuário criado com sucesso:", userCredential.user);

        // Atualiza o nome, se fornecido
        if (name.trim() !== "") {
          await updateProfile(userCredential.user, { displayName: name });
          console.log("✅ Nome atualizado no Firebase:", name);
        }

        // Envia para o Firestore
        console.log("📡 Enviando dados para o backend:", {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name,
        });

        await registerUserInDatabase(userCredential.user, name);
      } else {
        console.log("📡 Tentando logar com:", { email, password });
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("✅ Usuário logado:", userCredential.user);
      }

      navigate("/");
    } catch (err) {
      console.error("🔥 Erro ao autenticar:", err.code, err.message);
      setError(`Erro Firebase: ${err.message}`);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Usuário autenticado com Google:", user);

      // 🔹 Registra usuário no Firestore com nome (se existir no Google)
      await registerUserInDatabase(user, user.displayName);

      navigate("/");
    } catch (err) {
      setError("Erro ao autenticar com Google.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isRegistering ? "Criar Conta" : "Entrar"}</h2>
        <form onSubmit={handleEmailAuth}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Carregando..." : isRegistering ? "Cadastrar" : "Entrar"}
          </button>
        </form>
        <button onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Carregando..." : "Login com Google"}
        </button>
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Já tem conta? Entrar" : "Criar conta"}
        </p>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default AuthPage;
