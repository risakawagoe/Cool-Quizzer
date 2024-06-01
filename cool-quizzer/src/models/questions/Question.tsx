
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
    protected prompt: string = "";// TODO: can be private? 
    readonly type: QuestionType;
    constructor(type: QuestionType) {
        this.type = type;
    }
    getPrompt(): string {
        return this.prompt;
    }
    setPrompt(prompt:string) {
        this.prompt = prompt;
    }

    abstract cloneQuestion(): Question;
    abstract setUserInput(input: any): void;
    abstract setAnswers(answers: any): void;
    abstract initializeUserInput(): void;

    abstract getEditView(saveQuestion: (question: Question) => void): JSX.Element;
    abstract getTestView(saveQuestion: (question: Question) => void): JSX.Element;
    abstract getReviewView(): JSX.Element;
}

