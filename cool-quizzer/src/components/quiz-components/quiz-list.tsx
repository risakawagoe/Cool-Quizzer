import { FC } from "react";
import { Button, Flex, Group, Stack, Text } from "@mantine/core";
import { Question } from "../../models/questions/Question";

interface Props {
    questions: Array<Question>
    openModal: (title: string, element: JSX.Element) => void
    saveQuestion: (question: Question, index: number) => void
}

export const QuestionsList: FC<Props> = ({ questions, openModal, saveQuestion }) => {

    return(
        <Stack>
            {questions.map((question: Question, index) => (
                <Flex justify="space-between" align="flex-start" gap={12}>
                    <Group>
                        <Text>Question {index + 1}</Text>
                        <Text>{question.getPrompt()}</Text>
                    </Group>
                    <Group gap={8} flex="0 0 max-content">
                        <Button variant="default" size="xs" radius="xl" onClick={() => openModal(`Question ${index + 1}`, question.getEditView((question) => saveQuestion(question, index)))} >Edit</Button>
                        <Button variant="default" size="xs" radius="xl" onClick={() => {}} >Remove</Button>
                        <Button variant="default" size="xs" radius="xl" onClick={() => openModal(`Question ${index + 1}`, question.getTestView((question) => saveQuestion(question, index)))} >Preview</Button>
                    </Group>
                </Flex>
            ))}
        </Stack>
    );
}