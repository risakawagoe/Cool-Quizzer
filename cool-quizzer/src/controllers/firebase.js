import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { Quiz, QuizOverview } from "../models/Quiz";
import { Question, QuestionType } from "../models/questions/Question";
import { MultipleChoiceQuestion } from "../models/questions/MultipleChoiceQuestion";
import { ShortAnswerQuestion } from "../models/questions/ShortAnswerQuestion";
import { NoAnswerQuestion } from "../models/questions/NoAnswerQuestion";
import { MultipleSelectQuestion } from "../models/questions/MultipleSelectQuestion";
import { convertToObject } from "typescript";

const firebaseConfig = {
  apiKey: "AIzaSyBxs3Bl4-17wIQSFqIcYdX0JuuCLiye6eY",
  authDomain: "personal-projects-rkawagoe.firebaseapp.com",
  projectId: "personal-projects-rkawagoe",
  storageBucket: "personal-projects-rkawagoe.appspot.com",
  messagingSenderId: "371949880356",
  appId: "1:371949880356:web:466591be60164d6f6b84b1",
  measurementId: "G-ECW93C4J6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Firestore data converter
export const quizConverter = {
    toFirestore: (quiz) => {
        console.log('in converter')
        console.log(quiz)
        return {
            title: quiz.getTitle(),
            description: quiz.getDescription(),
            questions: quiz.getQuestions().map(question => { 
                console.log(question)
                console.log(question.getSerializableObject());
                console.log(JSON.stringify(question))

                // const keys = Object.keys(question);
                // const obj = {};
                // keys.forEach(key => obj[key] = question[key]);
                // console.log(obj);
                // console.log(obj["attachment"]);
                // console.log(question["attachment"]);
                // console.log(typeof question.attachment);
                // console.log(question.attachment)
                // console.log(question.getAttachment())
                // if(typeof question.attachment === "string") {
                //     obj.attachment = question.attachment;
                // }

                return { type: question.type, data: JSON.stringify(question.getSerializableObject()) };
            }),
            count: quiz.getQuestions().length,
            stats: quiz.getStats(),
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);

        console.log("data")
        console.log(data)

        const hasAllFields = Object.keys(data).includes("title") && 
                                Object.keys(data).includes("description") && 
                                Object.keys(data).includes("stats") && 
                                Object.keys(data).includes("questions");
        
        console.log('hasAllFields')
        console.log(hasAllFields)

        if(!hasAllFields) return null;

        const quiz = new Quiz();
        quiz.setTitle(data.title);
        quiz.setDescription(data.description);
        quiz.setStats(data.stats);

        if(Array.isArray(data.questions)) {
            data.questions.forEach(question => {
                const typeInfoAvailable = question.type !== undefined && typeof question.type === "number";
                console.log('type info available')
                console.log(typeInfoAvailable)
                if(typeInfoAvailable) {
                    let tmp = null;
                    console.log('>> ' + question.type)
                    switch(question.type) {
                        case QuestionType.MULTIPLE_CHOICE:
                            console.log('mc')
                            
                            tmp = MultipleChoiceQuestion.deserialize(question.data);
                            break;
                        case QuestionType.MULTIPLE_SELECT:
                            console.log('ms')
                            tmp = MultipleSelectQuestion.deserialize(question.data);
                            break;
                        case QuestionType.SHORT_ANSWER:
                            console.log('short')
                            tmp = ShortAnswerQuestion.deserialize(question.data);
                            break;
                        case QuestionType.NO_ANSWER:
                            console.log('no answer')
                            tmp = NoAnswerQuestion.deserialize(question.data);
                            break;
                        default:
                            console.log('none')
                            // fall-through
                    }
                    if(tmp) {
                        quiz.addQuestion(tmp);
                    }else {
                        console.log('deserialization failed')
                    }
                }
            })
        }else {
            console.log('questions is not array')
            return null;
        }

        console.log(quiz)
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
// export const questionConverter = {
//     toFirestore: (question) => {
//         const keys = Object.keys(question);
//         const obj = {};
//         keys.forEach(key => obj[key] = question[key]);
//         console.log(obj);
//         console.log(obj["attachment"]);
//         return {
//         };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         const overview = new QuizOverview(
//             snapshot.id, 
//             data.title, 
//             data.description, 
//             data.count, 
//             data.stats
//         );
//         return overview;
//     }
// };