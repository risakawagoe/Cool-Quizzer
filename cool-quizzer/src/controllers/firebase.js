import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { Quiz, QuizOverview } from "../models/Quiz";
import { QuestionType } from "../models/questions/Question";
import { MultipleChoiceQuestion } from "../models/questions/MultipleChoiceQuestion";
import { ShortAnswerQuestion } from "../models/questions/ShortAnswerQuestion";
import { NoAnswerQuestion } from "../models/questions/NoAnswerQuestion";
import { MultipleSelectQuestion } from "../models/questions/MultipleSelectQuestion";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Firestore data converter
export const quizConverter = {
    toFirestore: (quiz) => {
        return {
            title: quiz.getTitle(),
            description: quiz.getDescription(),
            questions: quiz.getQuestions().map(question => { 
                return { type: question.type, data: JSON.stringify(question.getSerializableObject()) };
            }),
            count: quiz.getQuestions().length,
            stats: quiz.getStats(),
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const hasAllFields = Object.keys(data).includes("title") && 
                                Object.keys(data).includes("description") && 
                                Object.keys(data).includes("stats") && 
                                Object.keys(data).includes("questions");
        

        if(!hasAllFields) return null;

        const quiz = new Quiz();
        quiz.setTitle(data.title);
        quiz.setDescription(data.description);
        quiz.setStats(data.stats);

        if(Array.isArray(data.questions)) {
            data.questions.forEach(question => {
                const typeInfoAvailable = question.type !== undefined && typeof question.type === "number";
                if(typeInfoAvailable) {
                    let tmp = null;
                    switch(question.type) {
                        case QuestionType.MULTIPLE_CHOICE:
                            tmp = MultipleChoiceQuestion.deserialize(question.data);
                            break;
                        case QuestionType.MULTIPLE_SELECT:
                            tmp = MultipleSelectQuestion.deserialize(question.data);
                            break;
                        case QuestionType.SHORT_ANSWER:
                            tmp = ShortAnswerQuestion.deserialize(question.data);
                            break;
                        case QuestionType.NO_ANSWER:
                            tmp = NoAnswerQuestion.deserialize(question.data);
                            break;
                        default:
                            // fall-through
                    }
                    if(tmp) {
                        quiz.addQuestion(tmp);
                    }
                }
            })
        }else {
            return null;
        }

        return quiz;
    }
};
export const quizOverviewConverter = {
    toFirestore: (quiz) => {
        return {};
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const overview = new QuizOverview(
            snapshot.id, 
            data.title, 
            data.description, 
            data.count, 
            data.stats
        );
        return overview;
    }
};