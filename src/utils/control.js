import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; // Manipulação firestore

export const checkAudioLimit = async (userId) => {
    console.log("User id 1", userId);
    const db = getFirestore();
    const userRef = doc(db, 'audioLimits', userId); // Referência ao vagabundo atual e seu limite de áudios
    const userDoc = await getDoc(userRef);
    const today = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD

    // Verifica se o mesmo existe e a data de hoje
    if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.lastAccessed === today) {
            return data.audioCount < 10; // Retorna true se ainda pode gerar áudio
        } else {
            // Reseta o contador para o novo dia
            await setDoc(userRef, { audioCount: 0, lastAccessed: today }, { merge: true });
            return true;
        }
    } else {
        // Caso seja a primeira vez que o usuário está acessando
        await setDoc(userRef, { audioCount: 0, lastAccessed: today });
        return true;
    }
}

export const incrementAudioCount = async (userId) => {
    const db = getFirestore();
    const userRef = doc(db, 'audioLimits', userId);
    const userDoc = await getDoc(userRef);
    const today = new Date().toISOString().split('T')[0];

    if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.lastAccessed === today) {
            // Se o documento não existir cria um novo documento com valor de 1
            await setDoc(userRef, { audioCount: data.audioCount + 1 }, { merge: true });
        }
    }
};

export const handlePlayAudio = async (userId) => {
    if (await checkAudioLimit(userId)) {
        await incrementAudioCount(userId);
    } else {
        alert("Você atingiu o limite de 10 áudios por hoje.");
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