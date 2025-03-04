export const criarArquivoAudio = async (text) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/text-to-speech/generate-audio`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return audioUrl;
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    return null;
  }
};
