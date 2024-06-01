import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { getQuestionTypeLabel } from "../../../models/questions/Question";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";
import { useEffect, useState } from "react";


export const MultipleSelectTestView: QuestionEditor<MultipleSelectQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useState<string[]>(() => {
        const tmp: string[] = [];
        question.getUserInput().forEach((selected, index) => {
            if(selected) {
                tmp.push(index.toString());
            }
        })
        return tmp;
    });

    useEffect(() => {
        saveUserInput();
    }, [userInput])

    const cards = question.getOptions().map((option, index) => (
        <Checkbox.Card value={index.toString()} key={index} p={12}>
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator variant="outline" radius="lg" color="blue" />
                <Text>{option.label}</Text>
            </Group>
        </Checkbox.Card>
    ));


    function saveUserInput() {
        const updatedQuestion: MultipleSelectQuestion = question.cloneQuestion();
        const tmp: Array<boolean> = new Array(updatedQuestion.getOptions().length).fill(false);
        userInput.forEach(input => tmp[Number.parseInt(input)] = true)
        updatedQuestion.setUserInput(tmp);
        console.log('saving user input')
        console.log(updatedQuestion)
        saveQuestion(updatedQuestion);
    }

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