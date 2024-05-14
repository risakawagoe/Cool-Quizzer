import { Flex, Textarea, Title } from "@mantine/core";
import { Question, QuestionType } from "./Question";
import { ShortAnswerEditor } from "../../components/question-editors/short-answer-editor";


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
    getFormElement(): JSX.Element {
        return(
            <Textarea />
        );
    }
    getEditor(): JSX.Element {
        return(
            <ShortAnswerEditor question={this} />
        );
    }
    getAnswerElement(): JSX.Element {
        return(
            <Flex
                direction={{ base: 'row', sm: 'row' }}
                gap={{ base: 'sm', sm: 'lg' }}
            >
                <Title>Correct Answer</Title>
                <p>{this.correctAnswer}</p>
                <Title>Your Answer</Title>
                <p>{this.userInput}</p>
            </Flex>
        );
    }
}
