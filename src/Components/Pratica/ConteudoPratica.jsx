import { useState, useEffect, useRef } from 'react'
import './ConteudoPratica.css'
import { criarArquivoAudio } from '../../utils/textToAudio';
import frases from '../../utils/frases.json'
import waves from '../../assets/waves.png'

const ConteudoPratica = ({ aumentarProgresso }) => {
    const [audioUrl, setAudioURL] = useState('');
    const [text, setText] = useState('');
    const audioRef = useRef(null);

    const gerarAudio = async () => {
        try {
            const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
            setText(fraseAleatoria);
            const url = await criarArquivoAudio(fraseAleatoria);
            if (url) {
                setAudioURL(url);
                console.log(url);
            } else {
                throw new Error("URL do áudio não foi gerado");
            }
        } catch (error) {
            console.log("Erro ao gerar áudio: ", error);
        }
    };

    useEffect(() => {
        gerarAudio();
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(error => console.log("Erro ao reproduzir o áudio: ", error));
        }
    }, [audioUrl]);

    const handleContinueClick = async () => {
        await gerarAudio();
        aumentarProgresso();
    }

    return (
        <>
            <div className='container-pratica'>
                <div className="texto-pratica">
                    <img src={waves} alt="" />
                    <p>Reproduza o <span>áudio</span>  para ouvir sua <span>frase.</span> </p>
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
        </>
    )
}

export default ConteudoPratica