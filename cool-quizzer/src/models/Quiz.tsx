import { MultipleChoiceQuestion } from "./questions/MultipleChoiceQuestion";
import { Question } from "./questions/Question";
import { ShortAnswerQuestion } from "./questions/ShortAnswerQuestion";

export class Quiz implements Iterable<Question> {
    private questions: Array<Question> = new Array();
    constructor() {
        // demo
        let short = new ShortAnswerQuestion();
        short.setPrompt("what is your name?");
        short.setAnswers("Your Name");
        
        
        let mc = new MultipleChoiceQuestion();
        mc.setPrompt("Which color is the color of a tomato?");
        mc.setAnswers([
            {label: "red", isCorrect: true},
            {label: "blue", isCorrect: false},
            {label: "green", isCorrect: false}
        ])
        this.questions.push(short);
        this.questions.push(mc);
    }

    [Symbol.iterator](): Iterator<Question> {
        return this.questions[Symbol.iterator]();
    }

    public displayElement(): JSX.Element {
        return(
            <>
            {this.questions.map((question, index) => (
                <div key={index}>
                    Question {index + 1}
                    {question.getDisplayElement(true)}
                </div>
            ))}
            </>
        );
    }
    public displayEditors(): JSX.Element {
        return(
            <>
            {this.questions.map((question, index) => (
                <div key={index}>
                    Question {index + 1}
                    {question.getEditor()}
                </div>
            ))}
            </>
        );
    }
}