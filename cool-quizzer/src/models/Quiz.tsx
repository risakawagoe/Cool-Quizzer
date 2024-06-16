import { FirestoreDataConverter } from "firebase/firestore";
import { Question, QuestionType } from "./questions/Question";
import { MultipleChoiceQuestion } from "./questions/MultipleChoiceQuestion";
import { MultipleSelectQuestion } from "./questions/MultipleSelectQuestion";
import { ShortAnswerQuestion } from "./questions/ShortAnswerQuestion";
import { NoAnswerQuestion } from "./questions/NoAnswerQuestion";

export interface QuizStats {
    playCount: number
    avgScore: number
    avgTime: number
    likes: number
}
function isQuizStats(obj: any): obj is QuizStats {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.playCount === 'number' &&
        typeof obj.avgScore === 'number' &&
        typeof obj.avgTime === 'number' &&
        typeof obj.likes === 'number';
}
export class QuizOverview {
    readonly id;
    readonly title;
    readonly description;
    readonly questionCount;
    readonly stats: QuizStats;
    constructor(id: string, title: string, description: string, questionCount: number, stats: QuizStats) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.questionCount = questionCount;
        this.stats = stats;
    }
}

export class Quiz {
    private title: string = "";
    private description: string = "";
    private questions: Array<Question> = [];
    private stats: QuizStats = { 
        playCount: 0,
        avgScore: 0,
        avgTime: 0,
        likes: 0
    }

    getTitle(): string {
        return this.title;
    }
    getDescription(): string {
        return this.description;
    }
    setTitle(title: string): void {
        this.title = title;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    public getQuestions(): Array<Question> {
        return this.questions;
    }
    public addQuestion(question: Question): void {
        this.questions.push(question);
    }
    public removeQuestion(index: number): void {
        this.questions.splice(index, 1);
    }
    public updateQuestion(question: Question, index: number) {
        if(index >= 0 && index < this.questions.length) {
            this.questions.splice(index, 1, question);
        }
    }
    public getStats(): QuizStats {
        return this.stats;
    }
    public setStats(stats: QuizStats) {
        this.stats = stats;
    }
    public clone(): Quiz {
        const copy = new Quiz();
        copy.setTitle(this.title);
        copy.setDescription(this.description);
        [...this.questions].forEach(question => copy.addQuestion(question));
        copy.setStats(this.stats);
        return copy;
    }
    public async getSerializableObject() {
        const promises: Promise<any>[] = [];
        for (const question of this.questions) {
            promises.push(question.getSerializableObject());
        }

        const serializableQuestions: any[] = await Promise.all(promises);

        return {
            title: this.title,
            description: this.description,
            questions: serializableQuestions,
            count: this.questions.length,
            stats: this.stats,
        }
    }
    static deserialize(obj: any): Quiz | null {
        const hasValidTitle = "title" in obj && typeof obj.title === "string";
        const hasValidDescription = "description" in obj && typeof obj.description === "string";
        const hasValidQuestions = "questions" in obj && Array.isArray(obj.questions) && obj.questions.every((item: any) => "type" in item && "data" in item && typeof item.type === "number");
        const hasValidCount = "count" in obj && typeof obj.count === "number";
        const hasValidStats = "stats" in obj && isQuizStats(obj.stats);

        if(hasValidTitle && hasValidDescription && hasValidQuestions && hasValidCount && hasValidStats) {
            const questions: Question[] = [];
            obj.questions.forEach((question: any) => {
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
                    questions.push(tmp);
                }
            })

            if(questions.length === obj.count) {
                const quiz = new Quiz();
                quiz.setTitle(obj.title);
                quiz.setDescription(obj.description);
                questions.forEach(question => quiz.addQuestion(question));
                quiz.setStats(obj.stats);
                return quiz;
            }else {
                console.error("Could not deserialize all questions.");
            }
        }
        return null;
    }
}
