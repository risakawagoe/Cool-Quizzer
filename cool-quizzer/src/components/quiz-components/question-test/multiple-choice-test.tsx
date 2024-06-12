import { Flex, Group, Radio, Stack, Text } from "@mantine/core";
import { QuestionEditor } from "../../../models/QuestionEditor";
import { MultipleChoiceQuestion } from "../../../models/questions/MultipleChoiceQuestion";
import { useEffect, useState } from "react";
import { QuestionPromptTemplate } from "../question-prompt-template";


export const MultipleChoiceTestView: QuestionEditor<MultipleChoiceQuestion> = ({ question, saveQuestion }) => {
    const [userInput, setUserInput] = useState<string>(question.getUserInput().toString());

    useEffect(() => {
        setUserInput(question.getUserInput().toString());
    }, [question])

    useEffect(() => {
        saveUserInput();
    }, [userInput])

    const cards = question.getOptions().map((option, index) => (
        <Flex key={index} gap={8} align="center">
            <Radio.Card value={index.toString()} key={index} p={12}>
                <Group wrap="nowrap" align="center">
                    <Radio.Indicator variant="outline" radius="lg"/>
                    <Text>{option}</Text>
                </Group>
            </Radio.Card>
        </Flex>
    ));

    function saveUserInput() {
        const updatedQuestion: MultipleChoiceQuestion = question.cloneQuestion();
        updatedQuestion.setUserInput(Number.parseInt(userInput));
        saveQuestion(updatedQuestion);
    }


    return(
        <div>
            <QuestionPromptTemplate prompt={question.getPrompt()} attachment={question.getAttachment()} />
            <Radio.Group
                value={userInput}
                onChange={setUserInput}
                withAsterisk
                required
            >
                <Stack pb="md" gap="xs">
                {question.getOptions().length === 0 && <Text size="sm" c="gray">No options.</Text>}
                {cards}
              </Stack>
            </Radio.Group>
        </div>
    );
}