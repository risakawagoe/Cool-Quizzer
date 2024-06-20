import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleSelectQuestion } from "../../../models/questions/MultipleSelectQuestion";
import { useEffect, useState } from "react";
import { QuestionPromptTemplate } from "../templates/question-prompt-template";


export const MultipleSelectTestView: QuestionEditor<MultipleSelectQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useState<string[]>([]);

    useEffect(() => {
        if(inputHasChanged(question)) {
            setUserInput(getUserInput(question));
        }
    }, [question]);

    useEffect(() => {
        if(inputHasChanged(question)) {
            saveUserInput();
        }
    }, [userInput]);

    const cards = question.getOptions().map((option, index) => (
        <Checkbox.Card value={index.toString()} key={index} p={12}>
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator variant="outline" radius="lg" color="blue" />
                <Text>{option.label}</Text>
            </Group>
        </Checkbox.Card>
    ));
    function getUserInput(question: MultipleSelectQuestion): string[] {
        const tmp: string[] = [];
        question.getUserInput().forEach((selected, index) => {
            if(selected) {
                tmp.push(index.toString());
            }
        });
        tmp.sort();
        return tmp;
    }

    function inputHasChanged(question: MultipleSelectQuestion): boolean {
        const inputA = getUserInput(question);
        const inputB = [...userInput].sort();
        return JSON.stringify(inputA) !== JSON.stringify(inputB);
    }

    function saveUserInput() {
        const updatedQuestion: MultipleSelectQuestion = question.cloneQuestion();
        const tmp: Array<boolean> = new Array(updatedQuestion.getOptions().length).fill(false);
        userInput.forEach(input => tmp[Number.parseInt(input)] = true)
        updatedQuestion.setUserInput(tmp);
        saveQuestion(updatedQuestion);
    }

    return(
        <div>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
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