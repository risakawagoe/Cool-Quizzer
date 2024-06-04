import { Question, QuestionType } from "./Question";
import { MultipleChoiceEditView } from "../../components/quiz-components/question-edit/multiple-choice-edit";
import { MultipleChoiceTestView } from "../../components/quiz-components/question-test/multiple-choice-test";
import { MultipleChoiceReviewView } from "../../components/quiz-components/question-review/multiple-choice-review";

export class MultipleChoiceQuestion extends Question {
    private options: Array<string> = [];
    private correctAnswer: number = -1;
    private userInput: number = -1;

    constructor() {
        super(QuestionType.MULTIPLE_CHOICE);
    }

    getOptions(): ReadonlyArray<string> {
        return [...this.options];
    }
    setOptions(options: Array<string>): void {
        this.options = [...options];
        this.initializeUserInput();
    }
    getAnswer():number {
        return this.correctAnswer;
    }
    setAnswers(answers: number): void {
        this.correctAnswer = answers;
    }

    getResult(): boolean {
        return this.userInput === this.correctAnswer;
    }

    isCorrect(index: number): boolean {
        return index === this.correctAnswer;
    }
    isSelected(index: number): boolean {
        return index === this.userInput;
    }

    cloneQuestion(): MultipleChoiceQuestion {
        const clone = new MultipleChoiceQuestion();
        clone.setPrompt(this.getPrompt());
        clone.setAttachment(this.getAttachment());
        clone.setOptions([...this.options]);
        clone.setAnswers(this.correctAnswer);
        clone.setExplanation(this.getExplanation());
        clone.setUserInput(this.userInput);
        return clone;
    }
    getUserInput(): number {
        return this.userInput;
    }
    setUserInput(input: number): void {
        if(this.options.length === 0) {
            this.userInput = -1;
        }

        this.userInput = this.isValidInput(input) ? input : -1;
    }
    initializeUserInput(): void {
        this.userInput = -1;
    }

    isValidInput(input: number): boolean {
        return input >= 0 && input < this.options.length;
    }

    getEditView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <MultipleChoiceEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <MultipleChoiceTestView question={this} saveQuestion={saveQuestion} />
        );
    }
    getReviewView(): JSX.Element {
        return(
            <MultipleChoiceReviewView question={this} saveQuestion={() => {}} />
        );
    }
}
