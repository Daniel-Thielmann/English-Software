import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; // Manipulação Firestore
import { formatDate } from "../Components/Hooks/Date";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 🔹 Função genérica para buscar dados do backend
export const fetchDataFromBackend = async (
  endpoint,
  method = "GET",
  body = null
) => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do backend: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
};

// 🔹 Verifica o limite de áudio do usuário
export const checkAudioLimit = async (userId) => {
  try {
    // 🔹 Tenta buscar o limite de áudio pelo backend primeiro
    const backendData = await fetchDataFromBackend(
      `check-audio-limit/${userId}`
    );

    if (backendData && backendData.canGenerateAudio !== undefined) {
      console.log("🔹 Dados do Backend:", backendData);
      return backendData.canGenerateAudio;
    }

    // 🔹 Se não conseguir pegar do backend, usa Firebase como fallback
    const db = getFirestore();
    const userRef = doc(db, "audioLimits", userId);
    const userDoc = await getDoc(userRef);
    const now = new Date().toISOString();
    const today = formatDate(now);

    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.lastAccessed === today) {
        return data.audioCount < 10;
      } else {
        await setDoc(
          userRef,
          { audioCount: 0, lastAccessed: today },
          { merge: true }
        );
        return true;
      }
    } else {
      await setDoc(userRef, { audioCount: 0, lastAccessed: today });
      return true;
    }
  } catch (error) {
    console.log("Erro ao verificar o limite de áudios: ", error);
    return false;
  }
};

// 🔹 Incrementa a contagem de áudios
export const incrementAudioCount = async (userId) => {
  try {
    // 🔹 Atualiza também no backend
    const backendResponse = await fetchDataFromBackend(
      `increment-audio-count/${userId}`,
      "POST"
    );

    if (!backendResponse) {
      console.warn("⚠️ Falha ao atualizar contagem no backend.");
    }

    // 🔹 Continua atualizando no Firebase
    const db = getFirestore();
    const userRef = doc(db, "audioLimits", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const { audioCount, lastAccessed } = userDoc.data();
      await setDoc(
        userRef,
        { audioCount: audioCount + 1, lastAccessed },
        { merge: true }
      );
    }
  } catch (error) {
    console.log("Erro ao incrementar contagem de áudios: ", error);
  }
};

// 🔹 Função para gerar áudio e atualizar contagem
export const handlePlayAudio = async (userId, gerarAudio) => {
  if (!userId) {
    alert("⚠️ Você precisa estar logado para usar esta função.");
    return;
  }

  const canGenerate = await checkAudioLimit(userId);
  if (canGenerate) {
    await gerarAudio();
    await incrementAudioCount(userId);
  } else {
    alert("🚫 Você atingiu o limite diário de áudios.");
  }
};
