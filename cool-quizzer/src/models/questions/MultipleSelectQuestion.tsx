import { Question, QuestionType } from "./Question";
import { MultipleSelectEditView } from "../../components/quiz-components/question-edit/multiple-select-edit";
import { MultipleSelectTestView } from "../../components/quiz-components/question-test/multiple-select-test";
import { MultipleSelectReviewView } from "../../components/quiz-components/question-review/multiple-select-review";

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

    isCorrect(index: number): boolean {
        const option = this.options.at(index);
        return option ? option.isCorrect : false;
    }
    isSelected(index: number): boolean {
        const selection = this.userInput.at(index);
        return selection !== undefined ? selection : false;
    }

    cloneQuestion(): MultipleSelectQuestion {
        const clone = new MultipleSelectQuestion();
        clone.setPrompt(this.getPrompt());
        clone.setAttachment(this.getAttachment());
        clone.setAnswers([...this.options]);
        clone.setExplanation(this.getExplanation());
        clone.setUserInput([...this.userInput]);
        return clone;
    }
    getResult(): number {
        const correctAnswers = this.options.filter(option => option.isCorrect).length;
        const correctSelection: number = this.options.filter((option, index) => this.isSelected(index) && option.isCorrect).length;
        const incorrectSelection: number = this.options.filter((option, index) => this.isSelected(index) && !option.isCorrect).length;
        return correctSelection <= incorrectSelection ? 0 : (correctSelection - incorrectSelection) / correctAnswers;
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
            <MultipleSelectReviewView question={this} saveQuestion={() => {}} />
        );
    }
}
