import { Question, QuestionType } from "./Question";
import { MultipleSelectEditView } from "../../components/quiz-components/question-edit/multiple-select-edit";
import { MultipleSelectTestView } from "../../components/quiz-components/question-test/multiple-select-test";

export interface Option {
    label: string, 
    isCorrect: boolean
}
export class MultipleSelectQuestion extends Question {
    private options: Array<Option> = [];
    private userInput: Array<boolean> = [];

    constructor() {
        super(QuestionType.MULTIPLE_SELECT);
    }

    getOptions(): ReadonlyArray<Option> {
        return [...this.options];
    }
    getAnswer(): ReadonlyArray<Option> {
        return this.getOptions();
    }
    setAnswers(answers: Array<Option>): void {
        this.options = [...answers];
        this.initializeUserInput();
    }

    cloneQuestion(): MultipleSelectQuestion {
        const clone = new MultipleSelectQuestion();
        clone.setPrompt(this.prompt);
        clone.setAnswers([...this.options]);
        clone.setUserInput([...this.userInput]);
        return clone;
    }

    getUserInput(): Array<boolean> {
        return this.userInput;
    }
    setUserInput(input: Array<boolean>): void {
        if(this.options.length === input.length) {
            this.userInput = [...input];
        }
    }
    initializeUserInput(): void {
        this.userInput = new Array(this.options.length).fill(false);
    }

    getEditView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <MultipleSelectEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <MultipleSelectTestView question={this} saveQuestion={saveQuestion} />
        );
    }
    getReviewView(): JSX.Element {
        return(
            <p>to be implemented</p>
        );
    }
}
