import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { NoAnswerQuestion } from "../../../models/questions/NoAnswerQuestion";


export const NoAnswerTestView: QuestionEditor<NoAnswerQuestion> = ({ question }) => {

    return(
        <div>
            <p>[{getQuestionTypeLabel(question.type)}] {question.getPrompt()}</p>
            <p>No answers expected.</p>
        </div>
    );
}