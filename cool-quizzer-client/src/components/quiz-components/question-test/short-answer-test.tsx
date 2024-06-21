import { ShortAnswerQuestion } from "../../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect } from "react";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";


export const ShortAnswerTestView: QuestionEditor<ShortAnswerQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useInputState(question.getUserInput());

    useEffect(() => {
        if(userInput !== question.getUserInput()) {
            setUserInput(question.getUserInput());
        }
    }, [question]);

    useEffect(() => {
        if(userInput !== question.getUserInput()) {
            saveUserInput();
        }
    }, [userInput]);

    function saveUserInput() {
        const updatedQuestion: ShortAnswerQuestion = question.cloneQuestion();
        updatedQuestion.setUserInput(userInput);
        saveQuestion(updatedQuestion);
    }

    return(
        <div>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <Textarea 
                label="Your Answer"
                value={userInput}
                autosize
                size="md"
                onChange={setUserInput}
            />
        </div>
    );
}