import api from "./api"; // 🔹 Agora usa Axios

export const criarArquivoAudio = async (text) => {
  try {
    const response = await api.post(
      "/api/text-to-speech/generate-audio",
      { text },
      {
        responseType: "blob", // 🔹 Define para receber um Blob
      }
    );

    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("❌ Erro ao gerar áudio:", error.message);
    return null;
  }
};
