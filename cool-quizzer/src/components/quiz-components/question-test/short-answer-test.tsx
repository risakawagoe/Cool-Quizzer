import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";


export const ShortAnswerTestView: QuestionEditor<ShortAnswerQuestion> = ({ question }) => {
    const [userInput, setUserInput] = useInputState(question.getUserInput());

    return(
        <div>
            <p>[{getQuestionTypeLabel(question.type)}] {question.getPrompt()}</p>
            <Textarea 
                label="Your Answer"
                value={userInput}
                onChange={setUserInput}
            />
        </div>
    );
}