import { useState, useRef } from 'react';
import { criarArquivoAudio } from '../../utils/textToAudio';
import frases from '../../utils/frases.json';

export const useConteudoPratica = (aumentarProgresso) => {
    const [audioUrl, setAudioURL] = useState('');
    const [text, setText] = useState('');
    const audioRef = useRef(null);

    const gerarAudio = async () => {
        try {
            console.log('Função gerarAudio chamada');
            const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
            setText(fraseAleatoria);
            console.log(fraseAleatoria);
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

    const handleContinueClick = async () => {
        await gerarAudio();
        aumentarProgresso();
    };

    return {
        audioUrl,
        text,
        audioRef,
        handleContinueClick
    };
};
