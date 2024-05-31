import { Question, QuestionType } from "./Question";
import { ShortAnswerEditView } from "../../components/quiz-components/question-edit/short-answer-edit";
import { ShortAnswerTestView } from "../../components/quiz-components/question-test/short-answer-test";


export class ShortAnswerQuestion extends Question {
    private correctAnswer: string = "";
    private userInput: string = "";

    constructor() {
        super(QuestionType.SHORT_ANSWER);
    }
    getAnswer(): string {
        return this.correctAnswer;
    }
    setAnswers(answers: string): void {
        this.correctAnswer = answers;
    }
    getUserInput(): string {
        return this.userInput;
    }
    setUserInput(input: string): void {
        this.userInput = input;
    }

    // Views
    getEditView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <ShortAnswerEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <ShortAnswerTestView question={this} saveQuestion={saveQuestion} />
        );
    }
    getReviewView(): JSX.Element {
        return(
            <p>to be implemented</p>
        );
        
    }
}
