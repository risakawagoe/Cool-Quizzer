import { Button, Center, Container, Flex, Group, Image, Loader, Modal, ScrollArea, Text } from '@mantine/core';
import './App.css';
import { QuizEditor } from './components/quiz-components/quiz-editor';
import { QuizList } from './components/quiz-components/quiz-list';
import { useEffect, useState } from 'react';
import { useDisclosure, useListState } from '@mantine/hooks';
import { QuizOverview } from './models/Quiz';
import { QuizPlayer } from './components/quiz-components/quiz-player';
import Logo from "./logo.png";
import { deleteQuiz, getAllQuizzes } from './controllers/quiz-controller';

function App() {
    const [opened, { open, close }] = useDisclosure(false);
    const [id, setId] = useState<string | undefined>(undefined);
    const [quizzes, handlers] = useListState<QuizOverview>([]);
    const [playerModalActive, setPlayerModalActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(true);

    useEffect(()  => {
        if(changed) {
            fetchQuizzes();
        }
    }, [changed]);

    async function fetchQuizzes() {
        setLoading(true);
        const result = await getAllQuizzes();
        setLoading(false);
        if(result.success) {
            handlers.setState(result.data);
        }else {
            alert('Sorry.. something went wrong, we are currently unable to fetch quiz data.');
        }
        setChanged(false);
    }

    function closeEditor() {
        close();
        setId(undefined);
    }
    function closePlayer() {
        setPlayerModalActive(false);
        setId(undefined);
    }

    function playQuiz(id: string) {
        setId(id);
        setPlayerModalActive(true);
    }
    function editQuiz(id: string) {
        setId(id);
        open();
    }
    async function deleteQuizById(id: string) {
        const deleted = await deleteQuiz(id);
        if(deleted) {
            setChanged(true);
        }else {
            alert('Sorry.. there is a connection issue with the server, we are currently unable to fetch quiz data.');
        }
    }

    const shadowStyle = (verticalLen: number) => {
        // 3 or -3 would be a good number
        return { boxShadow: `0px ${verticalLen}px 10px -1px rgba(0,0,0,0.4)` };
    }

    return (
        <>
            <Modal opened={opened} onClose={closeEditor} fullScreen scrollAreaComponent={ScrollArea.Autosize}>
                <QuizEditor id={id} closeEditor={closeEditor} changed={() => setChanged(true)} />
            </Modal>
            <Modal
                opened={playerModalActive}
                onClose={closePlayer}
                fullScreen
                radius={0}
                transitionProps={{ transition: 'fade', duration: 200 }}>
                    {id && <QuizPlayer id={id} closePlayer={closePlayer} changed={() => setChanged(true)} />}
            </Modal>
            <Flex direction="column" mih="100vh">
                <Group p={32} bg="black">
                    <Image src={Logo} alt="Cool Quizzer Logo" w={120} />
                </Group>
                <Container pb={40} flex={1} maw={980} w="100%">
                    <Group justify='flex-end' mt={32} mb={24}>
                        <Button variant='subtle' onClick={open}>Add new quiz</Button>
                    </Group>
                    {loading ?
                    <Center h={320}>
                        <Flex direction="column" justify="center" align="center">
                            <Text size="xs" c="cyan">loading quiz data</Text>
                            <Loader color="cyan" type="dots" />
                        </Flex>
                    </Center>:
                    <QuizList quizzes={quizzes} playQuiz={playQuiz} editQuiz={editQuiz} deleteQuiz={deleteQuizById} />}
                </Container>
                <Group p={32} bg="black" justify='center'>
                    <Text c="dimmed" size="xs">&copy; Cool Quizzer 2024</Text>
                </Group>
            </Flex>
        </>
    );
}

export default App;
