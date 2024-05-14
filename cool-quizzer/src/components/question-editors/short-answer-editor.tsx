import { ShortAnswerQuestion } from "../../models/questions/ShortAnswerQuestion";
import { QuestionEditor } from "../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../models/questions/Question";
import { Textarea } from "@mantine/core";
import { useState } from "react";
import { useInputState } from "@mantine/hooks";


export const ShortAnswerEditor: QuestionEditor<ShortAnswerQuestion> = ({ question }) => {
    const [correctAnswer, setCorrectAnswer] = useInputState(question.getAnswer());
    const [userInput, setUserInput] = useInputState(question.getUserInput());

    return(
        <div>
            <p>TYPE: {getQuestionTypeLabel(question.type)}</p>
            <p>PROMPT: {question.getPrompt()}</p>
            <p>CORRECT ANSWER:</p>
            <Textarea
                value={correctAnswer}
                onChange={setCorrectAnswer}
                />

            <p>USER INPUT</p>
            <Textarea 
                value={userInput}
                onChange={setUserInput}
            />
        </div>
    );
}