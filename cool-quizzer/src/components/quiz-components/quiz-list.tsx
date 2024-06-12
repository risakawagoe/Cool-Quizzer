import { FC, useEffect } from "react";
import { ActionIcon, Button, Card, Grid, Group, Menu, Stack, Text, Title, TypographyStylesProvider, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Quiz, QuizOverview } from "../../models/Quiz";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

interface Props {
    quizzes: Array<QuizOverview>
    // updateList: (list: Array<Quiz>) => void
    // saveQuiz: (quiz: Quiz, index: number) => void
    // removeQuiz: (index: number) => void
}

export const QuizList: FC<Props> = ({ quizzes }) => {
    const [list, handlers] = useListState<QuizOverview>([]);

    useEffect(() => {
        handlers.setState(quizzes);
    }, [quizzes])

    // function removeQuestionAt(index: number) {
    //     handlers.remove(index);
    //     removeQuiz(index);
    // }

    // function updateList(question: Question, index: number) {
    //     handlers.setItem(index, question);
    // }

    // function customButton(label: string, action: () => void, disabled: boolean) {
    //     return <Button variant="default" size="xs" radius="xl" onClick={action} disabled={disabled} >{label}</Button>;
    // }

    const card = (quiz: QuizOverview) => {
        return(
            <Card withBorder shadow="sm" radius="md">
                <Card.Section>
                    <Text fw={500}>{quiz.title}</Text>
                    <Text mt="sm" c="dimmed" size="sm">{quiz.description}</Text>
                </Card.Section>
                <Card.Section>
                    <Title>id: {quiz.id}</Title>
                    <Title>question count: {quiz.questionCount}</Title>
                    <Title>play count: {quiz.stats.playCount}</Title>
                    <Title>likes: {quiz.stats.likes}</Title>
                    <Title>avgScore: {quiz.stats.avgScore}</Title>
                    <Title>avgTime: {quiz.stats.avgTime}</Title>
                </Card.Section>
                <Card.Section>
                    <Group>
                        <Button>Play</Button>
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDots style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                color="red"
                            >
                                Delete
                            </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Card.Section>
            </Card>
        );
    }

    return(
        <Grid>
            {list.map(quiz => card(quiz))}
        </Grid>
    );
}