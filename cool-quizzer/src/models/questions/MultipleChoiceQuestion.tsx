import { Question, QuestionType } from "./Question";
import { MultipleChoiceEditView } from "../../components/quiz-components/question-edit/multiple-choice-edit";
import { MultipleChoiceTestView } from "../../components/quiz-components/question-test/multiple-choice-test";

interface Option {
    label: string, 
    isCorrect: boolean
}
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
    }
    getAnswer():number {
        return this.correctAnswer;
    }
    setAnswers(answers: number): void {
        this.correctAnswer = answers;
    }
    // setAnswers(answers: Array<Option>): void {
    //     answers.forEach((option, index) => {
    //         this.options.push(option.label);
            
    //         if(option.isCorrect) {
    //             this.correctAnswer = index;
    //         }
    //     })
    // }

    setUserInput(input: number): void {
        if(this.options.length === 0) {
            this.userInput = -1;
        }

        if(this.isValidInput(input)) {
            this.userInput = input;
        }
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
            <p>to be implemented</p>
        );
    }
}
