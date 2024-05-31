import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";
import { useState } from "react";


export const MultipleSelectTestView: QuestionEditor<MultipleSelectQuestion> = ({ question }) => {
    const [userInput, setUserInput] = useState<string[]>([]);

    const cards = question.getOptions().map((option, index) => (
        <Checkbox.Card value={index.toString()} key={index} p={12}>
        <Group wrap="nowrap" align="flex-start">
            <Checkbox.Indicator variant="outline" radius="lg" color="blue" />
            <Text>{option.label}</Text>
        </Group>
        </Checkbox.Card>
    ));

    return(
        <div>
            <p>[{getQuestionTypeLabel(question.type)}] {question.getPrompt()}</p>
            <Checkbox.Group
                value={userInput}
                onChange={setUserInput}
            >
                <Stack pb="md" gap="xs">
                {cards}
                </Stack>
            </Checkbox.Group>
        </div>
    );
}