import { useState, useEffect } from "react";
import { useConteudoPratica } from "../Hooks/UseConteudoPratica";
import Modal from "../Modal/Modal";
import "./ConteudoPratica.css";
import waves from "../../assets/waves.png";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  checkAudioLimit,
  handlePlayAudio,
  incrementAudioCount,
} from "../../utils/control"; // Funções de controle com firebase

const ConteudoPratica = ({ setProgresso, finalizarPratica }) => {
  const { audioUrl, audioRef, text, gerarAudio } = useConteudoPratica();
  const [inputText, setInputText] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [user, setUser] = useState(null);
  const [audioLimitError, setAudioLimitError] = useState("");
  const [acertos, setAcertos] = useState(0);
  const [audiosGerados, setAudiosGerados] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(""); // Para o feedback da resposta


  // Monitorar o fluxo de login com useState, assim vou impedir que o usuário comece a práticar sem estar logado
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        console.log("Erro ao tentar reproduzir o áudio:", e);
      });
    }
  }, [audioUrl]);

  // Isso tá muito feio mas eu reprovei em POO então ta tudo bem
  // Kkkkkkk mano sem logar vc nn vai estudar nao parceiro
  const handleStartClick = async () => {
    if (user) {
      const canGenerate = await checkAudioLimit(user.uid);

      if (canGenerate) {
        await handlePlayAudio(user.uid, gerarAudio, setAudioLimitError);
        setAudioLimitError("");
      } else {
        setAudioLimitError("Você atingiu o limite de 10 áudios por dia.");
        setModalMessage(audioLimitError); // Exibir mensagem de limite
        setShowModal(true);
      }
    } else {
      handleLogin();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleContinueClick = async () => {
    const canGenerate = await checkAudioLimit(user.uid);

    if (canGenerate) {
      if (inputText.toLocaleLowerCase() === text.toLocaleLowerCase()) {
        setIsCorrect(true);
        setFeedback(`Você acertou! Resposta correta: ${text}`);
        setModalMessage("Você acertou!");
        setShowModal(true);
        setProgresso((prevProgresso) => Math.min(prevProgresso + 10, 100));
        setAcertos((prevAcertos) => prevAcertos + 1);
        await incrementAudioCount(user.uid);
        setAudiosGerados((prevCount) => prevCount + 1);
        setInputText("");
        setAttempts(0);

        if (audiosGerados + 1 === 10) {
          finalizarPratica(acertos + 1);
        } else {
          await gerarAudio();
        }
      } else {
        setIsCorrect(false);
        setFeedback(`Você errou. Resposta correta: ${text}`);
        setAttempts((prevAttempts) => prevAttempts + 1);
      }
    } else {
      setAudioLimitError("Você atingiu o limite de 10 áudios por dia.");
      setModalMessage(audioLimitError);
      setShowModal(true);
    }
  };

  // Pular sem contabilizar pontos
  const handleSkip = async () => {
    const canGenerate = await checkAudioLimit(user.uid);

    if (canGenerate) {
      await incrementAudioCount(user.uid);
      setInputText("");
      setAttempts(0);

      if (audiosGerados + 1 === 10) {
        finalizarPratica(acertos);
      } else {
        await gerarAudio();
      }
    } else {
      setAudioLimitError("Você atingiu o limite de 10 áudios por dia.");
      setModalMessage(audioLimitError);
      setShowModal(true);
    }
  };

  // Kkkkkkk mano sem logar vc nn vai estudar nao parceiro
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.log("Erro ao fazer login:", e);
    }
  };

  return (
    <div className="container-pratica">
      {showModal && (
        <Modal
          message={modalMessage}
          feedback={feedback}
          onClose={closeModal}
          finalizarPratica={finalizarPratica}
          acertos={acertos}
        />
      )}
      <div className="texto-pratica">
        <img src={waves} alt="" />
        <p>
          Reproduza o <span>áudio</span> para ouvir sua <span>frase.</span>
        </p>
      </div>

      {audioUrl ? (
        <audio controls ref={audioRef}>
          <source src={audioUrl} type="audio/mpeg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      ) : (
        <div className="start-pratica">
          <button className="btn-start" onClick={handleStartClick}>
            Começar
          </button>
        </div>
      )}

      <div className="input-pratica">
        <textarea
          placeholder="Digite o que você ouviu: "
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="footer-pratica">
        <button className="btn-continue" onClick={handleContinueClick}>
          Continuar
        </button>

        {attempts >= 3 && (
          <button className="btn-skip" onClick={handleSkip}>
            Pular
          </button>
        )}
      </div>
    </div>
  );
};

export default ConteudoPratica;
