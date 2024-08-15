import { useConteudoPratica } from '../Pratica/UseConteudoPratica';
import './ConteudoPratica.css';
import waves from '../../assets/waves.png';

const ConteudoPratica = ({ aumentarProgresso }) => {
    const { audioUrl, audioRef, handleContinueClick } = useConteudoPratica(aumentarProgresso);

    return (
        <div className='container-pratica'>
            <div className="texto-pratica">
                <img src={waves} alt="" />
                <p>Reproduza o <span>áudio</span> para ouvir sua <span>frase.</span></p>
            </div>

            {audioUrl && (
                <audio controls ref={audioRef}>
                    <source src={audioUrl} type="audio/mpeg" />
                    Seu navegador não suporta elemento de áudio
                </audio>
            )}

            <div className="input-pratica">
                <textarea placeholder='Digite o que você ouviu: ' />
            </div>
            <div className="footer-pratica">
                <button className="btn-continue" onClick={handleContinueClick}>
                    Continue
                </button>
            </div>
        </div>
    );
}

export default ConteudoPratica;
