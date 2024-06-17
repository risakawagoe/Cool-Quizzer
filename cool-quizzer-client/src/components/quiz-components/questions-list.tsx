import { FC, useEffect } from "react";
import { Button, Card, Group, Stack, Text, TypographyStylesProvider } from "@mantine/core";
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
        handlers.setState(questions);
    }, [questions])

    function removeQuestionAt(index: number) {
        handlers.remove(index);
        removeQuestion(index);
    }

    function moveUp(from: number) {
        const to = from - 1;
        const prevItemExists = list.at(to) !== undefined;
        if(prevItemExists) {
            handlers.swap({ from, to });
        }
    }
    function moveDown(from: number) {
        const to = from + 1;
        const nextItemExists = list.at(to) !== undefined;
        if(nextItemExists) {
            handlers.swap({ from, to });
        }
    }

    function updateList(question: Question, index: number) {
        handlers.setItem(index, question);
        saveLiveChanges(question, index);
    }

    function customButton(label: string, action: () => void, disabled: boolean) {
        return <Button variant="default" size="xs" radius="xl" onClick={action} disabled={disabled} >{label}</Button>;
    }

    return(
        <Stack>
            {list.length === 0 && <Text size="sm" c="gray">No questions.</Text>}
            {list.map((question: Question, index) => (
                <Card shadow="sm" withBorder key={index}>
                    <Group justify="space-between" align="center" mb={12}>
                        <Text fw={500} size="lg">Question {index + 1}</Text>
                        <Group gap={8} justify="flex-end">
                            {customButton('Edit', () => openModal(`Question ${index + 1}`, question.getEditView((question) => saveQuestion(question, index))), false)}
                            {customButton('Remove', () => removeQuestionAt(index), false)}
                            {customButton('Move up', () => moveUp(index), index === 0)}
                            {customButton('Move down', () => moveDown(index), index === list.length - 1)}
                            {customButton('Preview', () => openModal(`Question ${index + 1}`, question.getTestView((question) => updateList(question, index))), false)}
                        </Group>
                    </Group>
                    <TypographyStylesProvider>
                        <div dangerouslySetInnerHTML={{ __html: question.getPrompt() }} />
                    </TypographyStylesProvider>
                </Card>
            ))}
        </Stack>
    );
}