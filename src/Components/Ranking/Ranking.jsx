// NÃO TO AFIM DE MECHER COM ISSO AGORA
// FIREBASE TÁ INTEGRADO E CONTABILIZANDO QUANTOS ÁUDIOS SOA GERADOS POR USUÁRIO, AGORA SÓ FALTA LIMITAR LÁ DEPOIS VAMOS VIR PRA CÁ

// import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
// import { db } from "./firebaseConfig";
// import { auth } from "../../utils/firebaseConfig";

// const updateRanking = async (userId, correctAnswers) => {
//     const rankingRef = collection(db, "rankings");
//     const today = new Date().setHours(0, 0, 0, 0);
//     const q = query(rankingRef, where("userId", "==", userId), where("date", "==", today));

//     const snapshot = await getDocs(q);
//     if (snapshot.empty) {
//         await addDoc(rankingRef, {
//             userId: userId,
//             correctAnswers: correctAnswers,
//             date: Timestamp.fromDate(new Date(today))
//         });
//     } else {
//         const doc = snapshot.docs[0];
//         const newCorrectAnswers = doc.data().correctAnswers + correctAnswers;
//         await doc.ref.update({ correctAnswers: newCorrectAnswers });
//     }
// }

// const handleCorrectAnswer = async () => {
//     const userId = auth.currentUser.uid;
//     await updateRanking(userId, 1)
// }




