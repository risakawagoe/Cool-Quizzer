import { Question, QuestionType } from "./Question";
import { MultipleChoiceEditView } from "../../components/quiz-components/question-edit/multiple-choice-edit";
import { MultipleChoiceTestView } from "../../components/quiz-components/question-test/multiple-choice-test";
import { MultipleChoiceReviewView } from "../../components/quiz-components/question-review/multiple-choice-review";
import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";
import { uploadFile } from "../../controllers/file-controller";

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
    calculateScore(autoMarking: boolean): void {
        this.score = this.getResult() ? 1 : 0;
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
    getReviewView(config: QuizConfig): JSX.Element {
        return(
            <MultipleChoiceReviewView config={config} question={this} />
        );
    }

    getPointsAssigned(autoMarking: boolean): number {
        return 1;
        // const isNoAnswerQuestion = type === QuestionType.NO_ANSWER;
        // const isNonmarkedShortAnswerQuestion = type === QuestionType.SHORT_ANSWER && !config.autoMarking;
        // return isNoAnswerQuestion || isNonmarkedShortAnswerQuestion ? 0 : 1;
    }

    static deserializable(obj: any): boolean {
        const validOptions = obj && "options" in obj && 
        Array.isArray(obj.options) && obj.options.length > 0 && 
        obj.options.every((option: any) => typeof option === 'string');
        const validCorrectAnswer = obj && "correctAnswer" in obj && typeof obj.correctAnswer === "number";
        return Question.deserializable(obj) && validOptions && validCorrectAnswer;
    }
    static deserialize(obj: any): Question | null {
        if(!MultipleChoiceQuestion.deserializable(obj)) return null;

        const question = new MultipleChoiceQuestion();

        try {
            question.setPrompt(obj.prompt);
            question.setAttachment(obj.attachment);
            question.setExplanation(obj.explanation);

            question.setOptions([...obj.options]);
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
                    options: [...this.options],
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
