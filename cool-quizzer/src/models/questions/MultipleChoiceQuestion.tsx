import { Group, Radio } from "@mantine/core";
import { Question, QuestionType } from "./Question";
import { MultipleChoiceEditor } from "../../components/question-editors/multiple-choice-editor";

interface Option {
    label: string, 
    isCorrect: boolean
}
export class MultipleChoiceQuestion extends Question {
    private options: Array<string> = new Array();
    private correctAnswer: number = -1;
    private userInput: number = -1;

    constructor() {
        super(QuestionType.MULTIPLE_CHOICE);
    }

    getOptions(): ReadonlyArray<string> {
        const immutableOptionsArray: ReadonlyArray<string> = [...this.options];
        return immutableOptionsArray;
    }
    getAnswer():number {
        return this.correctAnswer;
    }
    setAnswers(answers: Array<Option>): void {
        answers.forEach((option, index) => {
            this.options.push(option.label);
            
            if(option.isCorrect) {
                this.correctAnswer = index;
            }
        })
    }

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

    getEditor(): JSX.Element {
        return(
            <MultipleChoiceEditor question={this} />
        );
    }

    getFormElement(): JSX.Element {
        return (
            <Radio.Group
              withAsterisk
            >
              <Group>
                {this.options.map((option, index) => (
                    <Radio value={index} label={option} />
                ))}
                {/* <Radio value="red" label="Red" />
                <Radio value="blue" label="Blue" />
                <Radio value="green" label="Green" /> */}
              </Group>
            </Radio.Group>
          );
    }
    getAnswerElement(): JSX.Element {
        return(
            <p>Correct answer: {this.correctAnswer + 1}</p>
        );
    }
}
