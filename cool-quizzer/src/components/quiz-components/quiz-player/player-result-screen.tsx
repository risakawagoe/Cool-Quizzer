import { Accordion, ActionIcon, Box, Button, Card, Group, NumberFormatter, RingProgress, Text } from "@mantine/core";
import { FC, useState } from "react";
import { Question, QuestionType, getQuestionTypeLabel } from "../../../models/questions/Question";
import { IconArrowsMaximize, IconArrowsMinimize, IconHeart, IconHeartFilled, IconLogout, IconRotateClockwise } from "@tabler/icons-react";
import { QuizConfig } from "./player-config-screen";
import { getGradingColor } from "../../../controllers/grading-color";

interface Props {
    config: QuizConfig
    questions: Array<Question>
    score: { earned: number, max: number }
    liked: boolean
    toggleLiked: () => void
    restart: () => void
    exit: () => void
    time: { 'total': number, 'hours': number, 'minutes': number, 'seconds': number }
}

export const PlayerResultScreen: FC<Props> = ({ config, questions, score, liked, toggleLiked, restart, exit, time }) => {
    const [items, setItems] = useState<string[]>([]);
    const percentage = score.max > 0 ? Math.round((score.earned / score.max) * 100) : 0;

    function expandAllAccordion() {
        const allItems = new Array(questions.length).fill('').map((_, i) => i.toString());
        setItems([...allItems]);
    }
    function collapseAllAccordion() {
        setItems([]);
    }
    
    function formatTime(data: number) {
        return data.toString().padStart(2, '0');
    }
    return (
        <>
            <Card withBorder mb={24} pt={24} pb={24}>
                <Group justify="center" gap={28}>
                    <RingProgress
                        sections={[{ value: percentage, color: score.max > 0 ? getGradingColor(percentage) : "gray" }]}
                        size={100}
                        thickness={4}
                        roundCaps
                        label={<Text c={score.max > 0 ? getGradingColor(percentage) : "gray"} ta="center" size="md" fw={600}><NumberFormatter value={percentage} decimalScale={2} suffix="%" /></Text>}
                    />
                    <Group gap={24} align="flex-start">
                        <div>
                            <Text size="md" fw={500}>Total Score</Text>
                            <Text c="dimmed" size="xs">{score.earned} / {score.max}</Text>
                            <Text size="md" fw={500} mt={4}>Time</Text>
                            <Text c="dimmed" size="xs">{formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}</Text>
                        </div>
                        <div>
                            <Text size="md" fw={500}>Settings</Text>
                            <Text c="dimmed" size="xs">Shuffle: {config.shuffle ? 'ON' : 'OFF'}</Text>
                            <Text c="dimmed" size="xs">Auto-Marking: {config.autoMarking ? 'ON' : 'OFF'}</Text>
                            <Text c="dimmed" size="xs">Instant-Marking: {config.instantMarking ? 'ON' : 'OFF'}</Text>
                        </div>
                    </Group>
                </Group>
            </Card>
            <Group justify="space-between" gap={12} mb={12}>
                <Group justify="flex-start" gap={12}>
                    <Button 
                        variant="default" 
                        onClick={expandAllAccordion} 
                        rightSection={<IconArrowsMaximize 
                        style={{ width: "1rem", height: "1rem" }} stroke={1.5} />}>
                            Expand all
                    </Button>
                    <Button 
                        variant="default" 
                        onClick={collapseAllAccordion} 
                        rightSection={<IconArrowsMinimize 
                        style={{ width: "1rem", height: "1rem" }} stroke={1.5} />}>
                            Collapse all
                    </Button>
                </Group>
                <Group justify="flex-end" gap={12}>
                    <ActionIcon radius="xl" color="pink" variant="subtle" size="lg" aria-label="Like">
                        {liked ? 
                        <IconHeartFilled style={{ width: "1rem", height: "1rem" }} stroke={1.5} onClick={toggleLiked} />:
                        <IconHeart style={{ width: "1rem", height: "1rem" }} stroke={1.5} onClick={toggleLiked} />}
                    </ActionIcon>
                    <Button 
                        variant="subtle" 
                        color="green" 
                        onClick={restart}
                        leftSection={<IconRotateClockwise style={{ width: "1rem", height: "1rem" }} stroke={1.5} />}>
                            Restart
                    </Button>
                    <Button 
                        variant="subtle" 
                        color="blue" 
                        onClick={exit}
                        leftSection={<IconLogout style={{ width: "1rem", height: "1rem" }} stroke={1.5} />}>
                            Exit
                    </Button>
                </Group>
            </Group>
            <Accordion variant="separated" multiple value={items} onChange={setItems}>
                {questions.map((question, index) => (
                    <Accordion.Item key={index} value={index.toString()}>
                        <Accordion.Control>
                            <Group justify="space-between" align="center" mr={12}>
                                <Box>Question {index + 1}  <Text size="sm" c="dimmed">{getQuestionTypeLabel(question.type)}</Text></Box>
                                <Text size="sm" c="dimmed">{question.getPrecalculatedScore()} / {question.getPointsAssigned(config.autoMarking)}</Text>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>{question.getReviewView(config)}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
}