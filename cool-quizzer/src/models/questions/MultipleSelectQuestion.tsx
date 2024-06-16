import { Question, QuestionType } from "./Question";
import { MultipleSelectEditView } from "../../components/quiz-components/question-edit/multiple-select-edit";
import { MultipleSelectTestView } from "../../components/quiz-components/question-test/multiple-select-test";
import { MultipleSelectReviewView } from "../../components/quiz-components/question-review/multiple-select-review";
import { QuizConfig } from "../../components/quiz-components/quiz-player/player-config-screen";
import { uploadFile } from "../../controllers/file-controller";

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
        clone.setExplanation(this.getExplanation());
        clone.setAnswers([...this.options]);
        clone.setUserInput([...this.userInput]);
        return clone;
    }
    getCorrectSelectionCount(): number {
        return this.options.filter((option, index) => this.isSelected(index) && option.isCorrect).length;
    }
    getIncorrectSelectionCount(): number {
        return this.options.filter((option, index) => this.isSelected(index) && !option.isCorrect).length;
    }
    getResult(): number {
        const correctAnswers = this.options.filter(option => option.isCorrect).length;
        const correctSelection: number = this.getCorrectSelectionCount();
        const incorrectSelection: number = this.getIncorrectSelectionCount();
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
    calculateScore(): void {
        const correctAnswers = this.options.filter(option => option.isCorrect).length;
        const correctSelection: number = this.options.filter((option, index) => this.isSelected(index) && option.isCorrect).length;
        const incorrectSelection: number = this.options.filter((option, index) => this.isSelected(index) && !option.isCorrect).length;
        const rawScore = correctSelection <= incorrectSelection ? 0 : (correctSelection - incorrectSelection) / correctAnswers;
        this.score = Math.round(rawScore * 100) / 100;
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
    getReviewView(config: QuizConfig): JSX.Element {
        return(
            <MultipleSelectReviewView config={config} question={this} />
        );
    }
    getPointsAssigned(autoMarking: boolean): number {
        return 1;
    }

    static deserializable(obj: any): boolean {
        const validOptions = obj && "options" in obj && 
                    Array.isArray(obj.options) && obj.options.length > 0 && 
                    obj.options.every((option: any) => "label" in option && "isCorrect" in option && typeof option.label === "string" && typeof option.isCorrect === "boolean");
        return Question.deserializable(obj) && validOptions;
    }

    static deserialize(obj: any): Question | null {
        if(!MultipleSelectQuestion.deserializable(obj)) return null;

        const question = new MultipleSelectQuestion();

        try {
            question.setPrompt(obj.prompt);
            question.setAttachment(obj.attachment);
            question.setExplanation(obj.explanation);

            question.setAnswers([...obj.options]);
            question.setUserInput([...obj.userInput]);
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
                    userInput: [...this.userInput]
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
