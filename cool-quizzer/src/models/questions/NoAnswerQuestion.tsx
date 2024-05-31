import { NoAnswerEditView } from "../../components/quiz-components/question-edit/no-answer-edit";
import { NoAnswerReviewView } from "../../components/quiz-components/question-review/no-answer-review";
import { NoAnswerTestView } from "../../components/quiz-components/question-test/no-answer-test";
import { Question, QuestionType } from "./Question";


export class NoAnswerQuestion extends Question {

    constructor() {
        super(QuestionType.NO_ANSWER);
    }

    setAnswers(answers: any): void {}
    setUserInput(input: any): void {}

    // Views
    getEditView(saveQuestion: (question: Question, index: number) => void): JSX.Element {
        return(
            <NoAnswerEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question, index: number) => void): JSX.Element {
        return(
            <NoAnswerTestView question={this} saveQuestion={saveQuestion} />
        );
    }
    getReviewView(): JSX.Element {
        return(
            <p>to be implemented</p>
            // <NoAnswerReviewView question={this} />
        );
        
    }
}
