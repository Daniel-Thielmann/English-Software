import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; // Manipulação firestore
import { formatDate } from "../Components/Hooks/Date";
import { useConteudoPratica } from "../Components/Hooks/UseConteudoPratica";

export const checkAudioLimit = async (userId) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "audioLimits", userId); // Referência ao vagabundo atual e seu limite de áudios
    const userDoc = await getDoc(userRef);
    const now = new Date().toISOString();
    const today = formatDate(now);

    // Verifica se o mesmo existe e a data de hoje
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.lastAccessed === today) {
        return data.audioCount < 10; // Retorna true se ainda pode gerar áudio
      } else {
        // Reseta o contador para o novo dia
        await setDoc(
          userRef,
          { audioCount: 0, lastAccessed: today },
          { merge: true }
        );
        return true;
      }
    } else {
      // Caso seja a primeira vez que o usuário está acessando
      await setDoc(userRef, { audioCount: 0, lastAccessed: today });
      return true;
    }
  } catch (error) {
    console.log("Erro ao verificar o limite de áudios: ", error);
    return false; // Impede o áudio de ser gerado
  }
};

export const incrementAudioCount = async (userId) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "audioLimits", userId);
    const userDoc = await getDoc(userRef);
    const today = formatDate(new Date().toISOString);

    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.lastAccessed === today) {
        // Se o documento não existir cria um novo documento com valor de 1
        await setDoc(
          userRef,
          { audioCount: data.audioCount + 1 },
          { merge: true }
        );
      } else {
        // Isso deveria ser garantido no checkAudioLimit, mas como precaução bora de else
        await setDoc(
          userRef,
          { audioCount: 1, lastAccessed: today },
          { merge: true }
        );
      }
    }
  } catch (error) {
    console.log("Erro ao incrementar contagem de áudios: ", error);
  }
};

export const handlePlayAudio = async (userId) => {
    const { gerarAudio } = useConteudoPratica();

  if (userId) {
    const canGenerate = await checkAudioLimit(userId);
    if (canGenerate) {
      await gerarAudio();
      await incrementAudioCount(userId);
      setAudioLimitError("");
    } else {
      setAudioLimitError("Você atingiu o limite de 10 áudios por dia.");
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
