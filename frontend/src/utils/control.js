import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; // Manipulação firestore
import { formatDate } from "../Components/Hooks/Date";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const checkAudioLimit = async (userId) => {
  try {
    // 🔹 Tenta buscar o limite de áudio pelo backend primeiro
    const backendData = await fetchDataFromBackend(
      `check-audio-limit/${userId}`
    );

    if (backendData) {
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

export const fetchDataFromBackend = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados do backend");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
};

export const incrementAudioCount = async (userId) => {
  try {
    // 🔹 Atualiza também no backend
    await fetch(`${API_BASE_URL}/increment-audio-count/${userId}`, {
      method: "POST",
    });

    // 🔹 Continua atualizando no Firebase
    const db = getFirestore();
    const userRef = doc(db, "audioLimits", userId);
    const userDoc = await getDoc(userRef);
    const { audioCount, lastAccessed } = userDoc.data();
    await setDoc(
      userRef,
      { audioCount: audioCount + 1, lastAccessed },
      { merge: true }
    );
  } catch (error) {
    console.log("Erro ao incrementar contagem de áudios: ", error);
  }
};

export const handlePlayAudio = async (userId, gerarAudio) => {
  if (userId) {
    const canGenerate = await checkAudioLimit(userId);
    if (canGenerate) {
      await gerarAudio();
      await incrementAudioCount(userId);
    } else {
      console.log("SE FUDEU VIADO");
    }
  } else {
    handleLogin();
  }
};

// ## REGRAS DO FIREBASE:
// Estas regras permitem que apenas o usuário autenticado leia e escreva no seu próprio documento de audioLimits.

// service cloud.firestore {
//     match /databases/{database}/documents {
//       match /audioLimits/{userId} {
//         allow read, write: if request.auth != null && request.auth.uid == userId;
//       }
//     }
//   }
