import { Question, QuestionType } from "./Question";
import { ShortAnswerEditView } from "../../components/quiz-components/question-edit/short-answer-edit";
import { ShortAnswerTestView } from "../../components/quiz-components/question-test/short-answer-test";
import { ShortAnswerReviewView } from "../../components/quiz-components/question-review/short-answer-review";
import { getSimilarityScore } from "../../controllers/text-similarity-api";
import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";
import { uploadFile } from "../../controllers/file-controller";


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

    getPointsAssigned(autoMarking: boolean): number {
        return autoMarking ? 1 : 0;
    }

    static deserializable(obj: any): boolean {
        const validCorrectAnswer = obj && "correctAnswer" in obj && typeof obj.correctAnswer === "string";
        return Question.deserializable(obj) && validCorrectAnswer;
    }
    static deserialize(obj: any): Question | null {
        if(!ShortAnswerQuestion.deserializable(obj)) return null;

        const question = new ShortAnswerQuestion();

        try {
            question.setPrompt(obj.prompt);
            question.setAttachment(obj.attachment);
            question.setExplanation(obj.explanation);

            question.setAnswers(obj.correctAnswer);
            question.setUserInput(obj.userInput);
        }catch(error) {
            console.log('deserialization failed');
            return null;
        }
        return question;
    }
    async getSerializableObject() {
        const serialized = (url: string) => {
            return {
                type: this.type,
                data: {
                    prompt: this.getPrompt(),
                    attachment: url,
                    explanation: this.getExplanation(),
                    correctAnswer: this.correctAnswer,
                    userInput: this.userInput
                }
            }
        }

        const attachment = this.getAttachment();
        if(attachment instanceof File) {
            try {
                const result = await uploadFile(attachment);
                if(result.success) {
                    return serialized(result.url);
                }
            }catch(error) {
                console.error(error)
            }
        }else if(typeof attachment === "string" && attachment.length > 0) {
            return serialized(attachment);
        }
        return serialized("");
    }
}
