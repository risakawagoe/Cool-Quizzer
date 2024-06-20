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

    useEffect(()  => {
        fetchQuizzes();
    }, []);

    async function fetchQuizzes() {
        setLoading(true);
        const result = await getAllQuizzes();
        setLoading(false);
        if(result.success) {
            handlers.setState(result.data);
        }else {
            alert('Sorry.. something went wrong, we are currently unable to fetch quiz data.');
        }
    }

    function closeEditor() {
        close();
        setId(undefined);
        fetchQuizzes();
    }
    function closePlayer() {
        setPlayerModalActive(false);
        setId(undefined);
        fetchQuizzes();
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
            fetchQuizzes();
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
            <Group p={32} bg="black">
                <Image src={Logo} alt="Cool Quizzer Logo" w={120} />
            </Group>
            <Modal opened={opened} onClose={() => { close(); setId(undefined); }} fullScreen scrollAreaComponent={ScrollArea.Autosize}>
                <QuizEditor id={id} closeEditor={closeEditor} />
            </Modal>
            <Modal
                opened={playerModalActive}
                onClose={closePlayer}
                fullScreen
                radius={0}
                transitionProps={{ transition: 'fade', duration: 200 }}>
                    {id && <QuizPlayer id={id} close={closePlayer} />}
            </Modal>
            <Container pb={40}>
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
        </>
    );
}

export default App;
