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
        this.userInput = new Array(answers.length).fill(false);
    }

    getUserInput(): Array<boolean> {
        return this.userInput;
    }
    setUserInput(input: Array<boolean>): void {
        if(this.options.length === input.length) {
            this.userInput = [...input];
        }
    }

    getEditView(saveQuestion: (question: Question, index: number) => void): JSX.Element {
        return(
            <MultipleSelectEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question, index: number) => void): JSX.Element {
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
