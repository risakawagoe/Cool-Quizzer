import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";

export enum QuestionType {
    MULTIPLE_CHOICE,
    MULTIPLE_SELECT,
    SHORT_ANSWER,
    // TRUE_FALSE, 
    // FILLIN_BLANK, 
    // INPUT_NUMBER, 
    NO_ANSWER
}

export const QUESTION_TYPE_LABEL = [
    "Multiple Choice",
    "Multiple Select",
    "Short Answer",
    "No Answer"
];

export function getQuestionTypeLabel(type: QuestionType): string {
    const label : string | undefined = QUESTION_TYPE_LABEL.at(type);
    return label === undefined ? "" : label;
}

export abstract class Question {
    private prompt: string = "";
    private explanation: string = "";
    private attachment: File | null = null;
    protected marked: boolean = false;
    protected score: number = 0;
    readonly type: QuestionType;
    constructor(type: QuestionType) {
        this.type = type;
    }
    getExplanation(): string {
        return this.explanation;
    }
    setExplanation(explanation: string): void {
        this.explanation = explanation;
    }
    getPrompt(): string {
        return this.prompt;
    }
    setPrompt(prompt:string): void {
        this.prompt = prompt;
    }
    getAttachment(): File | null {
        return this.attachment;
    }
    setAttachment(attachment: File | null): void {
        this.attachment = attachment;
    }
    isMarked() {
        return this.marked;
    }
    getPrecalculatedScore(): number {
        return this.score;
    }
    async mark(autoMarking: boolean): Promise<number> {
        await this.calculateScore(autoMarking);
        this.marked = true;
        return this.score
    }
    async getScore(autoMarking: boolean): Promise<number> {
        if(!this.marked) {
            await this.mark(autoMarking);
        }
        return this.score;
    }

    resetState() {
        this.score = 0;
        this.marked = false;
        this.initializeUserInput();
    }

    abstract cloneQuestion(): Question;
    abstract setUserInput(input: any): void;
    abstract setAnswers(answers: any): void;
    abstract initializeUserInput(): void;
    abstract calculateScore(autoMarking: boolean): void;

    abstract getEditView(saveQuestion: (question: Question) => void): JSX.Element;
    abstract getTestView(saveQuestion: (question: Question) => void): JSX.Element;
    abstract getReviewView(config: QuizConfig): JSX.Element;
}

