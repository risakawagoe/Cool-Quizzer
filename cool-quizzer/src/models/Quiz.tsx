import { Question } from "./questions/Question";

export interface QuizStats {
    playCount: number
    avgScore: number
    avgTime: number
    likes: number
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
}