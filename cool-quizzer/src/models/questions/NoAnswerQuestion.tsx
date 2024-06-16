import { NoAnswerEditView } from "../../components/quiz-components/question-edit/no-answer-edit";
import { NoAnswerReviewView } from "../../components/quiz-components/question-review/no-answer-review";
import { NoAnswerTestView } from "../../components/quiz-components/question-test/no-answer-test";
import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";
import { uploadFile } from "../../controllers/file-upload-controller";
import { Question, QuestionType } from "./Question";


export class NoAnswerQuestion extends Question {

    constructor() {
        super(QuestionType.NO_ANSWER);
    }

    cloneQuestion(): NoAnswerQuestion {
        const clone = new NoAnswerQuestion();
        clone.setPrompt(this.getPrompt());
        clone.setExplanation(this.getExplanation());
        clone.setAttachment(this.getAttachment());
        return clone;
    }

    setAnswers(answers: any): void {}
    setUserInput(input: any): void {}
    initializeUserInput(): void {}
    calculateScore(autoMarking: boolean): void {}

    // Views
    getEditView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <NoAnswerEditView question={this} saveQuestion={saveQuestion} />
        );
    }
    getTestView(saveQuestion: (question: Question) => void): JSX.Element {
        return(
            <NoAnswerTestView question={this} saveQuestion={saveQuestion} />
        );
    }
    getReviewView(config: QuizConfig): JSX.Element {
        return(
            <NoAnswerReviewView config={config} question={this} />
        );
        
    }
    getPointsAssigned(autoMarking: boolean): number {
        return 0;
    }

    static deserializable(obj: any): boolean {
        return Question.deserializable(obj);
    }
    static deserialize(obj: any): Question | null {
        if(!NoAnswerQuestion.deserializable(obj)) return null;

        const question = new NoAnswerQuestion();

        try {
            question.setPrompt(obj.prompt);
            question.setAttachment(obj.attachment);
            question.setExplanation(obj.explanation);
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
