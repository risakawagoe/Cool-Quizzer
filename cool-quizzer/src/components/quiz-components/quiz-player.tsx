import { FC, useState } from "react";
import { Box, Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { Question } from "../../models/questions/Question";
import { Quiz } from "../../models/Quiz";
import { useInterval, useListState } from "@mantine/hooks";
import { PlayerConfigScreen, QuizConfig } from "./quiz-player/player-config-screen";
import { PlayerRunningScreen } from "./quiz-player/player-running-screen";
import { PlayerResultScreen } from "./quiz-player/player-result-screen";

interface Props {
    quiz: Quiz
    saveLiveChanges: (question: Question, index: number) => void
    close: () => void
}

export const QuizPlayer: FC<Props> = ({ quiz, close }) => {
    const enum Screen {
        CONFIG, RUNNING, RESULT
    }
    const [screen, setScreen] = useState(Screen.CONFIG);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<QuizConfig>({ shuffle: false, autoMarking: false, instantMarking: false });
    const [index, setIndex] = useState(0);
    const [questions, questionsHandlers] = useListState(quiz.getQuestions());
    const [totalScore, setTotalScore] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const interval = useInterval(() => setElapsedSeconds((s) => s + 1), 1000);

    const buttonNext: JSX.Element = <Button onClick={goToNextQuestion} variant="default">Next</Button>;
    const buttonCheckAnswer: JSX.Element = <Button variant="outline" onClick={markCurrentQuestion}>Check Answer</Button>;
    const buttonSubmit: JSX.Element = <Button variant="outline" onClick={submitQuiz}>Submit</Button>;

    function playerControlElements(): JSX.Element {
        const timer = getTimeElapsed();
        const formatPlural = (time: number) => {
            return time === 1 ? '' : 's';
        }
        const formatTimer = (hours: number, minutes: number, seconds: number) => {
            return `${hours} Hour${formatPlural(hours)}, ${minutes} Minute${formatPlural(minutes)}, ${seconds} Second${formatPlural(seconds)}`;
        };
        return (
            <Group justify="space-between">
                <Button onClick={goToPrevQuestion} variant="default" disabled={index === 0}>Previous</Button>
                <Text c="dimmed" size="sm">{formatTimer(timer.hours, timer.minutes, timer.seconds)}</Text>
                {nextControlElement()}
            </Group>
        );
    }
    function nextControlElement(): JSX.Element {
        const notMarked = !(questions.at(index)!.isMarked());
        const isLastQuestion = index === questions.length - 1;
        const instantMarkingON = notMarked ? buttonCheckAnswer : (isLastQuestion ? buttonSubmit : buttonNext);
        const instantMarkingOFF = !isLastQuestion ? buttonNext : buttonSubmit;
        return config.instantMarking ? instantMarkingON : instantMarkingOFF;
    }
    function saveQuestion(question: Question) {
        questionsHandlers.setItem(index, question);
    }
    async function markCurrentQuestion() {
        const current = questions.at(index);
        if(current !== undefined) {
            await current!.mark(config.autoMarking);
            saveQuestion(current);
        }
    }
    function shuffleQuestions() {
        const shuffled = [...questions];
        const length = shuffled.length;
        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        questionsHandlers.setState(shuffled);
    }
    function goToPrevQuestion() {
        if(index > 0) {
            setIndex(index - 1);
        }
    }
    function goToNextQuestion() {
        if(index < quiz.getQuestions().length - 1) {
            setIndex(index + 1);
        }
    }
    function startQuiz(config: QuizConfig) {
        setConfig(config);
        if(config.shuffle) {
            shuffleQuestions();
        }
        setElapsedSeconds(0);
        interval.start();
        setScreen(Screen.RUNNING);
    }
    function restartQuiz() {
        resetQuestionsState();
        resetPlayerState();
    }
    function resetQuestionsState() {
        const tmp = [...questions];
        tmp.forEach(question => question.resetState());
        questionsHandlers.setState(tmp);
    }
    function resetPlayerState() {
        setIndex(0);
        setTotalScore(0);
        interval.stop();
        setScreen(Screen.CONFIG);
    }
    function exitQuiz() {
        resetQuestionsState();
        close();
    }
    async function submitQuiz() {
        interval.stop();
        setLoading(true);
        const marking: Array<Promise<number>> = [];
        questions.forEach(question => marking.push(question.mark(config.autoMarking)));
        const scores = await Promise.all(marking);
        setTotalScore(scores.reduce((accumulator, score) => accumulator + score, 0));

        // send data to backend to update stats (score, time, play-count)

        setScreen(Screen.RESULT);
        setLoading(false);
    }
    function getTimeElapsed() {
        const HOUR_IN_SECONDS = 60 * 60;
        const MINUTE_IN_SECONDS = 60;
        const hours = Math.floor(elapsedSeconds / HOUR_IN_SECONDS);
        const minutes = Math.floor((elapsedSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS);
        const seconds = elapsedSeconds % MINUTE_IN_SECONDS;
        return {
            'total': elapsedSeconds,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }


    return(
        <Box pos="relative">
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
            <Box maw={920} ml="auto" mr="auto">
                <Title size="lg" fw={500} mb={12}>{quiz.getTitle()}</Title>
                <Text c="dimmed" mb={20}>{quiz.getDescription()}</Text>
                {screen === Screen.CONFIG && <PlayerConfigScreen 
                    config={config} 
                    meta={{ 
                        title: quiz.getTitle(), 
                        description: quiz.getDescription(), 
                        count: questions.length, 
                        stats: { 
                            likes: quiz.getStats().likes, 
                            avgTime: quiz.getStats().avgTime, 
                            avgScore: quiz.getStats().avgScore 
                        }
                    }} 
                    start={startQuiz} />}
                {screen === Screen.RUNNING && questions.at(index) !== undefined && 
                    <>
                        <PlayerRunningScreen 
                            config={config} 
                            question={questions.at(index)!} 
                            index={index} 
                            saveQuestion={saveQuestion} />
                        {playerControlElements()}
                    </>}
                {screen === Screen.RESULT && <PlayerResultScreen config={config} questions={questions} totalScore={totalScore} restart={restartQuiz} exit={exitQuiz} time={getTimeElapsed()} />}
            </Box>
        </Box>
    );
}