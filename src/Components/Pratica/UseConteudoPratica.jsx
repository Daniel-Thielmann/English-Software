import { useState, useRef } from 'react';
import { criarArquivoAudio } from '../../utils/textToAudio';
import frases from '../../utils/frases.json';

export const useConteudoPratica = () => {
    const [audioUrl, setAudioURL] = useState('');
    const [text, setText] = useState('');
    const audioRef = useRef(null);

    const gerarAudio = async () => {
        try {
            console.log('Função gerarAudio chamada');
            const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
            setText(fraseAleatoria);
            console.log('Frase aleatória:', fraseAleatoria);
            const url = await criarArquivoAudio(fraseAleatoria);
            if (url) {
                setAudioURL(url);
                console.log('URL do áudio gerado:', url);
            } else {
                throw new Error("URL do áudio não foi gerado");
            }
        } catch (error) {
            console.log("Erro ao gerar áudio:", error);
        }
    };

    return {
        audioUrl,
        text, // Retorne o texto gerado
        audioRef,
        gerarAudio // Exponha a função para gerar áudio
    };
};
