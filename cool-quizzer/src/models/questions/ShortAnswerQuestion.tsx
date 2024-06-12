import { Question, QuestionType } from "./Question";
import { ShortAnswerEditView } from "../../components/quiz-components/question-edit/short-answer-edit";
import { ShortAnswerTestView } from "../../components/quiz-components/question-test/short-answer-test";
import { ShortAnswerReviewView } from "../../components/quiz-components/question-review/short-answer-review";
import { getSimilarityScore } from "../../controllers/text-similarity-api";
import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";


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

    cloneQuestion(): ShortAnswerQuestion {
        const clone = new ShortAnswerQuestion();
        clone.setPrompt(this.getPrompt());
        clone.setExplanation(this.getExplanation());
        clone.setAttachment(this.getAttachment());
        clone.setAnswers(this.correctAnswer);
        clone.setUserInput(this.userInput);
        return clone;
    }
    getUserInput(): string {
        return this.userInput;
    }
    setUserInput(input: string): void {
        this.userInput = input;
    }
    initializeUserInput(): void {
        this.userInput = "";
    }
    async calculateScore(autoMarking: boolean) {
        if(autoMarking) {
            const rawScore = await getSimilarityScore(this.userInput, this.correctAnswer);
            this.score = Math.round(rawScore * 100) / 100;
        }else {
            this.score = 0;
        }
    }

    // Views
    getEditView(saveQuestion: (question: Question) => void): JSX.Element {
        return <ShortAnswerEditView question={this} saveQuestion={saveQuestion} />;
    }
    getTestView(saveQuestion: (question: Question) => void): JSX.Element {
        return <ShortAnswerTestView question={this} saveQuestion={saveQuestion} />;
    }
    getReviewView(config: QuizConfig): JSX.Element {
        return <ShortAnswerReviewView config={config} question={this}/>;
    }
}
