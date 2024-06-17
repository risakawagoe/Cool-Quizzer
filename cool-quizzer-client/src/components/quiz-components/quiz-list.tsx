import { FC, useEffect } from "react";
import { ActionIcon, Badge, Button, Card, Group, Menu, Stack, Text, Tooltip, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { QuizOverview } from "../../models/Quiz";
import { IconCardsFilled, IconChartDotsFilled, IconDots, IconEdit, IconHeartFilled, IconHourglassFilled, IconPlayerPlayFilled, IconTrash, IconUserFilled } from "@tabler/icons-react";

interface Props {
    quizzes: Array<QuizOverview>
    playQuiz: (id: string) => void
    editQuiz: (id: string) => void
    deleteQuiz: (id: string) => void
}

export const QuizList: FC<Props> = ({ quizzes, playQuiz, editQuiz, deleteQuiz }) => {
    const [list, handlers] = useListState<QuizOverview>(quizzes);

    useEffect(() => {
        handlers.setState(quizzes);
    }, [quizzes])


    const card = (quiz: QuizOverview, index: number) => {
        return(
            <Card key={index} withBorder shadow="sm" radius="md" miw={320}>
                <Card.Section p="md" withBorder>
                    <Group align="flex-start">
                        <Text flex={1} fw={500} lineClamp={3}>{quiz.title}</Text>
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray">
                                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item 
                                    onClick={() => editQuiz(quiz.id)}
                                    leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                    >
                                    Edit
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => deleteQuiz(quiz.id)}
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                    color="red"
                                    >
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    {quiz.description.trim().length > 0 && <Text mt="xs" c="dimmed" size="sm" lineClamp={5}>{quiz.description}</Text>}
                </Card.Section>
                <Card.Section p="md">
                    <Stack>
                        <Group>
                            <Group wrap="nowrap" gap={4} align="center">
                                <IconCardsFilled color="gray" size="1.05rem" stroke={1.5} />
                                <Text size="xs" c="gray">{quiz.questionCount} questions</Text>
                            </Group>
                            <Group wrap="nowrap" gap={4} align="center">
                                <IconUserFilled color="gray" size="1.05rem" stroke={1.5} />
                                <Text size="xs" c="gray">{quiz.stats.playCount} times played</Text>
                            </Group>
                            <Tooltip withArrow color="gray" arrowSize={5} label="Average Score">
                                <Group wrap="nowrap" gap={4} align="center">
                                    <IconChartDotsFilled color="gray" size="1.05rem" stroke={1.5} />
                                    <Text size="xs" c="gray">{quiz.stats.avgScore} %</Text>
                                </Group>
                            </Tooltip>
                            <Tooltip withArrow color="gray" arrowSize={5} label="Average Completion Time">
                                <Group wrap="nowrap" gap={4} align="center">
                                    <IconHourglassFilled color="gray" size="1.05rem" stroke={1.5} />
                                    <Text size="xs" c="gray">{Math.ceil(quiz.stats.avgTime / 60)} minutes</Text>
                                </Group>
                            </Tooltip>
                        </Group>
                        <Group>
                            <Button
                                flex={1}
                                variant="light"
                                leftSection={<IconPlayerPlayFilled style={{ width: "1rem", height: "1rem" }} stroke={1.5} />}
                                radius="xl"
                                size="sm"
                                onClick={() => playQuiz(quiz.id)}
                            >
                                Play
                            </Button>
                            <Badge size="xl" p={0} color="white">
                                <Group wrap="nowrap" gap={4}>
                                    <IconHeartFilled color="pink" style={{ width: "1rem", height: "1rem" }} />
                                    <Text size="sm" color="pink">{quiz.stats.likes}</Text>
                                </Group>
                            </Badge>
                        </Group>
                    </Stack>
                </Card.Section>
            </Card>
        );
    }

    return(
        <Group grow align="flex-start">
            {list.map((quiz, index) => card(quiz, index))}
        </Group>
    );
}