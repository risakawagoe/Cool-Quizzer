import { ShortAnswerQuestion } from "../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../models/questions/MultipleChoiceQuestion";
import { getQuestionTypeLabel } from "../../models/questions/Question";


export const MultipleChoiceEditor: QuestionEditor<MultipleChoiceQuestion> = ({ question }) => {
    return(
        <div>
            <p>TYPE: {getQuestionTypeLabel(question.type)}</p>
            <p>PROMPT: {question.getPrompt()}</p>
            <p>OPTIONS:
                {question.getOptions().map((option, index) => (
                    <p key={index}>{index + 1}. {option}</p>
                ))}
            </p>
            <p>CORRECT ANSWER: {question.getOptions().at(question.getAnswer())}</p>
            <p>USER INPUT: not implemented yet</p>
        </div>
    );
}