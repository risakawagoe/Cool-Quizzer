import { FC, useEffect } from "react";
import { Button, Flex, Group, Stack, Text } from "@mantine/core";
import { Question } from "../../models/questions/Question";
import { useListState } from "@mantine/hooks";

interface Props {
    questions: Array<Question>
    openModal: (title: string, element: JSX.Element) => void
    saveQuestion: (question: Question, index: number) => void
    removeQuestion: (index: number) => void
    saveLiveChanges: (question: Question, index: number) => void
}

export const QuestionsList: FC<Props> = ({ questions, openModal, saveQuestion, removeQuestion, saveLiveChanges }) => {
    const [list, handlers] = useListState<Question>([]);

    useEffect(() => {
        console.log('quiz-list')
        console.log(questions)
        handlers.setState(questions);
    }, [questions])

    useEffect(() => {
        console.log('in useEffect()')
        console.log(list)
    }, [list])

    function removeQuestionAt(index: number) {
        handlers.remove(index);
        removeQuestion(index);
    }

    function updateList(question: Question, index: number) {
        handlers.setItem(index, question);
        console.log('list')
        console.log(list)
        saveLiveChanges(question, index);
    }

    return(
        <Stack>
            {list.length === 0 && <Text size="sm" c="gray">No questions.</Text>}
            {list.map((question: Question, index) => (
                <Flex key={index} justify="space-between" align="flex-start" gap={12}>
                    <Group>
                        <Text>Question {index + 1}</Text>
                        <Text>{question.getPrompt()}</Text>
                    </Group>
                    <Group gap={8} flex="0 0 max-content">
                        <Button variant="default" size="xs" radius="xl" onClick={() => openModal(`Question ${index + 1}`, question.getEditView((question) => saveQuestion(question, index)))} >Edit</Button>
                        <Button variant="default" size="xs" radius="xl" onClick={() => removeQuestionAt(index)} >Remove</Button>
                        <Button variant="default" size="xs" radius="xl" onClick={() => openModal(`Question ${index + 1}`, question.getTestView((question) => updateList(question, index)))} >Test</Button>
                    </Group>
                </Flex>
            ))}
        </Stack>
    );
}