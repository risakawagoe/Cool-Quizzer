import { FC, useState } from "react"
import { Button, Card, Center, Container, Group, NumberFormatter, RingProgress, Switch, Text } from "@mantine/core"
import { getGradingColor } from "../../../utils/grading-color"


export interface QuizConfig {
    shuffle: boolean
    autoMarking: boolean
    instantMarking: boolean
}
interface Props {
    config: QuizConfig
    meta: {title: string, description: string, count: number, stats: {likes: number, avgTime: number, avgScore: number}}
    start: (config: QuizConfig) => void
}
export const PlayerConfigScreen: FC<Props> = ({ config, meta, start }) => {
    const [shuffle, setShuffle] = useState(config.shuffle)
    const [autoMarking, setAutoMarking] = useState(config.autoMarking)
    const [instantMarking, setInstantMarking] = useState(config.instantMarking)

    const controls = [
        { 
            title: 'Shuffle', 
            description: 'Questions will be presented in randomised order',
            state: shuffle,
            action: (state:boolean) => setShuffle(state)
        },
        { 
            title: 'Auto Marking', 
            description: 'Short answer questions will be automatically marked based on how similar your answer is to the answer key.',
            state: autoMarking,
            action: (state: boolean) => setAutoMarking(state)
        },
        { 
            title: 'Instant Marking', 
            description: 'Each question will be marked instantly before moving on to the next question.',
            state: instantMarking,
            action: (state: boolean) => setInstantMarking(state)
        },
    ];

    const controlSection = controls.map(control => (
        <Group justify="space-between" wrap="nowrap" gap="xl" mb={12} key={control.title}>
            <div>
                <Text size="sm" fw={500}>{control.title}</Text>
                <Text size="xs" c="dimmed">
                    {control.description}
                </Text>
            </div>
            <Switch 
                onLabel="ON" 
                offLabel="OFF" 
                className="switch" 
                size="lg" 
                checked={control.state} 
                onChange={(event) => control.action(event.currentTarget.checked)} />
        </Group>
    ))

    const avgTimeInMinutes = Math.ceil(meta.stats.avgTime / 60);

    const statsRing = (
        <Card withBorder p="lg" radius="md" mt={20} w="100%" className="quiz-stats-ring">
            <Group justify="center" align="center" gap={12}>
                <RingProgress
                    roundCaps
                    thickness={4}
                    size={100}
                    sections={[{ value: meta.stats.avgScore, color: getGradingColor(meta.stats.avgScore) }]}
                    label={
                    <div>
                        <Text ta="center" fz="md" className="label">
                        {meta.stats.avgScore.toFixed(0)}%
                        </Text>
                        <Text ta="center" fz="xs" c="dimmed">Avg Score</Text>
                    </div>
                    }
                />
                <Container w="max-content" m={0}>
                    <Text size="xl" fw={500}>{meta.count}</Text>
                    <Text fz="xs" c="dimmed">Questions</Text>
                    <Group mt={10}>
                        <div>
                            <Text size="sm" fw={500}>{meta.stats.likes}</Text>
                            <Text size="xs" c="dimmed">Likes</Text>
                        </div>
                        <div>
                            <Text size="sm" fw={500}><NumberFormatter value={avgTimeInMinutes} decimalScale={0} /> minutes</Text>
                            <Text size="xs" c="dimmed">Avg Completion Time</Text>
                        </div>
                    </Group>
                </Container>
            </Group>
        </Card>
    );

    return(
        <>
            {statsRing}
            <Card withBorder radius="md" p="xl" mt={20} className="quiz-controls">
                <Text fz="lg" className="title" fw={500}>Quiz Configuration</Text>
                <Text fz="xs" c="dimmed" mt={3} mb="xl">Choose how you want to play the quiz</Text>
                {controlSection}
            </Card>
            <Center>
                <Button onClick={() => start({ shuffle, autoMarking, instantMarking })} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }} radius="xl" size="md" mt={32} mb={20}>START</Button>
            </Center>
        </>
    )
}