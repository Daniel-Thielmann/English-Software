import { useState, useEffect } from 'react';
import { useConteudoPratica } from '../Pratica/UseConteudoPratica';
import './ConteudoPratica.css';
import waves from '../../assets/waves.png';

const ConteudoPratica = ({ setProgresso }) => {
    const { audioUrl, audioRef, text, gerarAudio } = useConteudoPratica();
    const [showContinue, setShowContinue] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showRestart, setShowRestart] = useState(false);

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(error => {
                console.error("Erro ao tentar reproduzir o áudio:", error);
            });
            setShowContinue(true);
        }
    }, [audioUrl]);

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    const handleContinueClick = () => {
        if (inputText.toLocaleLowerCase() === text.toLocaleLowerCase()) {
            setIsCorrect(true);
            setProgresso(prevProgresso => Math.min(prevProgresso + 10, 100)); // Atualiza o progresso -> trabalhar melhor no progresso depois 
            gerarAudio(); // Gera um novo áudio
            setInputText('');
            setAttempts(0);
        } else {
            setIsCorrect(false);
            setAttempts(prevAttempts => prevAttempts + 1);
        }
    };

    const handleStartClick = async () => {
        await gerarAudio();
    };

    const handleShowAnswerClick = () => {
        setShowAnswer(true);
        setShowRestart(true);
    };

    const handleRestart = () => {
        setAttempts(0);
        setShowAnswer(false);
        setShowRestart(false);
        setInputText('');
        setIsCorrect(null);
        setProgresso(0); // Zera o progresso diretamente ao clicar em mostrar resposta (justo, né)
        gerarAudio();
    };

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

            {isCorrect === true && <p className="success-message">Você acertou!</p>}
            {isCorrect === false && !showAnswer && <p className="error-message">Tente novamente.</p>}

            <div className="footer-pratica">
                {showContinue && !showAnswer && (
                    <button className="btn-continue" onClick={handleContinueClick}>
                        Continuar
                    </button>
                )}
                {attempts >= 3 && !showAnswer && (
                    <button className="btn-show-answer" onClick={handleShowAnswerClick}>
                        Mostrar Resposta?
                    </button>
                )}
            </div>

            {showAnswer && (
                <div className="answer-display">
                    <p>Resposta correta: {text}</p>
                    {showRestart && (
                        <button className="btn-restart" onClick={handleRestart}>
                            Recomeçar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConteudoPratica;
