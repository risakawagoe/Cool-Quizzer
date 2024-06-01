import { Radio, Stack } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { useEffect, useState } from "react";


export const MultipleChoiceTestView: QuestionEditor<MultipleChoiceQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useState<string>(question.getUserInput().toString());
    // const [userInput, setUserInput] = useState('-1');

    useEffect(() => {
        saveUserInput();
    }, [userInput])

    function saveUserInput() {
        const updatedQuestion: MultipleChoiceQuestion = question.cloneQuestion();
        updatedQuestion.setUserInput(Number.parseInt(userInput));
        saveQuestion(updatedQuestion);
    }


    return(
        <div>
            <p>[{getQuestionTypeLabel(question.type)}] {question.getPrompt()}</p>
            <Radio.Group
                value={userInput}
                onChange={setUserInput}
                withAsterisk
                required
            >
              <Stack>
                {question.getOptions().map((option, index) => (
                    <Radio key={index} value={index.toString()} label={option} />
                ))}
              </Stack>
            </Radio.Group>
        </div>
    );
}