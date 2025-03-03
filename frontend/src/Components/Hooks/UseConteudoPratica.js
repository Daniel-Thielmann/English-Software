import { useState, useRef } from "react";
import { criarArquivoAudio } from "../../utils/textToAudio";
import frases from "../../utils/frases.json";

export const useConteudoPratica = () => {
  const [audioUrl, setAudioURL] = useState("");
  const [text, setText] = useState("");
  const audioRef = useRef(null);

  const gerarAudio = async () => {
    try {
      const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
      setText(fraseAleatoria);
      const url = await criarArquivoAudio(fraseAleatoria);
      if (url) {
        setAudioURL(url);
        console.log("URL do áudio gerado:", url);
      } else {
        throw new Error("URL do áudio não foi gerado");
      }
    } catch (error) {
      console.log("Erro ao gerar áudio:", error);
    }
  };

  return {
    audioUrl,
    text,
    audioRef,
    gerarAudio,
  };
};
