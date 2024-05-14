
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
    protected prompt: string = "";
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
    getTestingDisplay(): JSX.Element {
        return this.getDisplayElement(true);
    }
    getAnswerDisplay(): JSX.Element {
        return this.getDisplayElement(false);
    }
    getDisplayElement(isTestMode: boolean): JSX.Element {
        return (
        <>
            <p>{this.getPrompt()}</p>
            {isTestMode ? this.getFormElement() : this.getAnswerElement()}
        </>
        )
    }

    abstract setUserInput(input: any): void;
    abstract setAnswers(answers: any): void;

    abstract getEditor(): JSX.Element;
    abstract getFormElement(): JSX.Element;
    abstract getAnswerElement(): JSX.Element;
}
