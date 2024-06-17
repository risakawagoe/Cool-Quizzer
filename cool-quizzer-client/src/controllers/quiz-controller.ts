import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Quiz, QuizOverview, QuizStats } from "../models/Quiz";
import { db, quizOverviewConverter } from "./firebase";

const DB_COLLECTION_NAME = "quizzes";

export async function createQuiz(quiz: Quiz): Promise<{ success: boolean, id: string }> {
    try {
        const serializableQuiz = await quiz.getSerializableObject();
        const docRef = await addDoc(collection(db, DB_COLLECTION_NAME), serializableQuiz);
        return { success: true, id: docRef.id };
    }catch(error) {
        console.error(error);
        return { success: false, id: '' };
    }
}

export async function updateQuiz(id: string, quiz: Quiz): Promise<{ success: boolean }> {
    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const serializableQuiz = await quiz.getSerializableObject();
            await updateDoc(docRef, serializableQuiz);
            return { success: true };
        } else {
            return { success: false };
        }
    }catch(error) {
        console.error(error);
        return { success: false };
    }
}

export async function updateQuizStats(id: string, stats: QuizStats): Promise<{ success: boolean }> {
    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { stats: stats });
            return { success: true };
        } else {
            return { success: false };
        }
    }catch(error) {
        console.error(error);
        return { success: false };
    }
}

export async function getAllQuizzes(): Promise<{ success: boolean, data: QuizOverview[] }> {
    const quizzes: QuizOverview[] = [];
    try {
        const querySnapshot = await getDocs(collection(db, DB_COLLECTION_NAME).withConverter(quizOverviewConverter));
        querySnapshot.forEach((doc) => {
            quizzes.push(doc.data());
        });
    }catch(error) {
        console.error(error);
        return { success: false, data: [] };
    }
    return { success: true, data: quizzes };
}

export async function getQuiz(id: string): Promise<{ success: boolean, data: Quiz | null }> {

    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const deserialized: Quiz | null = Quiz.deserialize(docSnap.data());
            return { success: deserialized !== null, data: deserialized };
        } else {
            return { success: false, data: null };
        }
    }catch(error) {
        console.log(error);
        return { success: false, data: null };
    }
}
export async function deleteQuiz(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, DB_COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await deleteDoc(docRef);
            return true;
        } else {
            return false;
        }
    }catch(error) {
        console.error(error);
        return false;
    }
}