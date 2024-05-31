import { Divider, Title } from "@mantine/core";
import { Question } from "./questions/Question";

export class Quiz implements Iterable<Question> {
    private questions: Array<Question> = [];

    public [Symbol.iterator](): Iterator<Question> {
        return this.questions[Symbol.iterator]();
    }

    public getQuestions(): ReadonlyArray<Question> {
        return [...this.questions];
    }

    public addQuestion(question: Question): void {
        this.questions.push(question);
    }

    public updateQuestion(question: Question, index: number) {
        if(index >= 0 && index < this.questions.length) {
            this.questions.splice(index, 1, question);
        }
    }

    public displayEditors(): JSX.Element {
        return(
            <>
                {this.questions.map((question, index) => (
                    <div key={index}>
                        <Title fz={20} c="blue" >Question {index + 1}</Title>
                        {question.getEditView(this.updateQuestion, index)}
                        <Divider size="lg" mt={12} mb={20} color="blue" />
                    </div>
                ))}
            </>
        );
    }
    public displayTestViews(): JSX.Element {
        return(
            <>
                {this.questions.map((question, index) => (
                    <div key={index}>
                        <Title fz={20} c="green" >Question {index + 1}</Title>
                        {question.getTestView(this.updateQuestion, index)}
                        <Divider size="lg" mt={12} mb={20} color="green" />
                    </div>
                ))}
            </>
        );
    }
    public displayReviewViews(): JSX.Element {
        return(
            <>
                {this.questions.map((question, index) => (
                    <div key={index}>
                        <Title fz={20} c="orange" >Question {index + 1}</Title>
                        {question.getReviewView()}
                        <Divider size="lg" mt={12} mb={20} color="orange" />
                    </div>
                ))}
            </>
        );
    }
}