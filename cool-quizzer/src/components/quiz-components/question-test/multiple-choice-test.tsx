import { Radio, Stack } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { useState } from "react";


export const MultipleChoiceTestView: QuestionEditor<MultipleChoiceQuestion> = ({ question }) => {
    const [userInput, setUserInput] = useState('-1');

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
                    <Radio value={index.toString()} label={option} />
                ))}
              </Stack>
            </Radio.Group>
        </div>
    );
}