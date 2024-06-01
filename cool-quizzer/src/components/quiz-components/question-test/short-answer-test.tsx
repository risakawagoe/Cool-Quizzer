import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect } from "react";


export const ShortAnswerTestView: QuestionEditor<ShortAnswerQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useInputState(question.getUserInput());

    useEffect(() => {
        saveUserInput();
    }, [userInput])

    function saveUserInput() {
        const updatedQuestion: ShortAnswerQuestion = question.cloneQuestion();
        updatedQuestion.setUserInput(userInput);
        saveQuestion(updatedQuestion);
    }

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