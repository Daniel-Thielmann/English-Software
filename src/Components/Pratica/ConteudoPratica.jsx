import { useState, useEffect } from 'react';
import { useConteudoPratica } from '../Pratica/UseConteudoPratica';
import './ConteudoPratica.css';
import waves from '../../assets/waves.png';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { checkAudioLimit, handlePlayAudio, incrementAudioCount } from '../../utils/control'; // Funções de controle com firebase

const ConteudoPratica = ({ setProgresso }) => {
    const { audioUrl, audioRef, text, gerarAudio } = useConteudoPratica();
    const [showContinue, setShowContinue] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showSkip, setShowSkip] = useState(false);
    const [user, setUser] = useState(null);
    const [audioLimitError, setAudioLimitError] = useState('');

    // Monitorar o fluxo de login com useState, assim vou impedir que o usuário comece a práticar sem estar logado
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(e => {
                console.log("Erro ao tentar reproduzir o áudio:", e);
            });
            setShowContinue(true);
        }
    }, [audioUrl]);

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    // Isso tá muito feio mas eu reprovei em POO então ta tudo bem
    const handleContinueClick = async () => {
        if (inputText.toLocaleLowerCase() === text.toLocaleLowerCase()) {
            setIsCorrect(true);
            setProgresso(prevProgresso => Math.min(prevProgresso + 10, 100)); // Atualiza o progresso -> trabalhar melhor no progresso depois
            await gerarAudio();
            await incrementAudioCount();
            await gerarAudio();
            setInputText('');
            setAttempts(0);
        } else {
            setIsCorrect(false);
            setAttempts(prevAttempts => prevAttempts + 1);
        }
    };

    const handleSkip = async () => {
        if (user) {
            console.log("User ID:", user.uid);

            try {
                await incrementAudioCount(user.uid);
                setShowAnswer(true);
                setShowSkip(false);
                setInputText('');
                setAttempts(0);
                await gerarAudio();
            } catch (error) {
                console.error("Erro ao incrementar contagem de áudio:", error);
            }
        } else {
            console.log("Usuário não está logado. Não é possível incrementar contagem.");
        }
        // setShowAnswer(true);
        // setShowSkip(false);
        // setInputText('');
        // setAttempts(0);
        // await gerarAudio();
        // await incrementAudioCount();
    };

    // Kkkkkkk mano sem logar vc nn vai estudar nao parceiro
    const handleStartClick = async () => {

        if (user) {
            console.log("User ID:", user.uid);

            const canGenerate = await checkAudioLimit(user.uid);

            if (canGenerate) {
                await gerarAudio();
                await handlePlayAudio(user.uid);
                await incrementAudioCount(user.uid);
                setAudioLimitError('')
            }
            else {
                setAudioLimitError('Você atingiu o limite de 10 áudios por dia.')
            }
        }
        else {
            handleLogin();
        }


        // if (user) {
        //     await gerarAudio();
        // }
        // else {
        //     handleLogin();
        // }
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

    // const handleRestart = () => {
    //     setAttempts(0);
    //     setShowAnswer(false);
    //     setShowSkip(false);
    //     setInputText('');
    //     setIsCorrect(null);
    //     setProgresso(0); // Zera o progresso diretamente ao clicar em mostrar resposta (justo, né)
    //     gerarAudio();
    // };

    return (
        <div className='container-pratica'>
            <div className="texto-pratica">
                <img src={waves} alt="" />
                <p>Reproduza o <span>áudio</span> para ouvir sua <span>frase.</span></p>
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
                    placeholder='Digite o que você ouviu: '
                    value={inputText}
                    onChange={handleTextChange}
                />
            </div>

            {isCorrect === true && <p className="success-message" id='msg'>Você acertou!</p>}
            {isCorrect === false && !showSkip && <p className="error-message" id='msg'>Tente novamente.</p>}
            {audioLimitError && <p className='error-message'>{audioLimitError}</p>}

            <div className="footer-pratica">
                {showContinue && !showSkip && (
                    <button className="btn-continue" onClick={handleContinueClick}>
                        Continuar
                    </button>
                )}
                {attempts >= 3 && !showSkip && (
                    <button className="btn-show-answer" onClick={handleSkip}>
                        Pular
                    </button>
                )}
            </div>
        </div>
    );
}

export default ConteudoPratica;
