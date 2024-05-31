import { Group, Radio } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { useState } from "react";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";


export const MultipleSelectReviewView: QuestionEditor<MultipleSelectQuestion> = ({ question }) => {
    const [userInput, setUserInput] = useState('0');

    return(
        <div>
            <p>[{getQuestionTypeLabel(question.type)}] {question.getPrompt()}</p>
            <Radio.Group
                value={userInput}
                onChange={setUserInput}
                withAsterisk
                required
            >
              <Group>
                {question.getOptions().map((option, index) => (
                    <Radio value={index.toString()} label={option.label} />
                ))}
              </Group>
            </Radio.Group>
        </div>
    );
}