import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
    apiKey: "f9021a15e002ebb28775113e2503911e",
});

export const criarArquivoAudio = async (text) => {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': 'f9021a15e002ebb28775113e2503911e',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5"
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const reader = response.body.getReader();
        const stream = new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        push();
                    });
                }
                push();
            }
        });

        const arrayBuffer = await new Response(stream).arrayBuffer();
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        return audioUrl;
    } catch (error) {
        console.error("Erro ao gerar áudio:", error);
        return null;
    }
};

