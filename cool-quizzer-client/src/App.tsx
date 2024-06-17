import { Button, Container, Group, Image, Modal, ScrollArea } from '@mantine/core';
import './App.css';
import { QuizEditor } from './components/quiz-components/quiz-editor';
import { QuizList } from './components/quiz-components/quiz-list';
import { useEffect, useState } from 'react';
import { useDisclosure, useListState } from '@mantine/hooks';
import { QuizOverview } from './models/Quiz';
import { deleteQuiz, getAllQuizzes } from './controllers/quiz-controller';
import { QuizPlayer } from './components/quiz-components/quiz-player';
import Logo from "./logo.png";

function App() {
    const [opened, { open, close }] = useDisclosure(false);
    const [id, setId] = useState<string | undefined>(undefined);
    const [quizzes, handlers] = useListState<QuizOverview>([]);
    const [playerModalActive, setPlayerModalActive] = useState(false);

    useEffect(()  => {
        fetchQuizzes();
    }, [])

    async function fetchQuizzes() {
        const result = await getAllQuizzes();
        if(result.success) {
            handlers.setState(result.data);
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
        // console.log('PLAY: ' + id);
        setId(id);
        setPlayerModalActive(true);
    }
    function editQuiz(id: string) {
        // console.log('EDIT: ' + id);
        setId(id);
        open();
    }
    async function deleteQuizById(id: string) {
        // console.log('DELETE: ' + id);
        const deleted = await deleteQuiz(id);
        if(deleted) {
            fetchQuizzes();
        }else {
            alert('Sorry.. Something went wrong, Please try again later.');
        }
    }

    return (
        <>
            <Group p={32} bg="black">
                <Image src={Logo} alt="Cool Quizzer Logo" w={160} />
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
            <Container>
                <Group justify='flex-end' mt={32} mb={24}>
                    <Button variant='subtle' onClick={open}>Add new quiz</Button>
                </Group>
                <QuizList quizzes={quizzes} playQuiz={playQuiz} editQuiz={editQuiz} deleteQuiz={deleteQuizById} />
            </Container>
        </>
    );
}

export default App;
