import { Box, Button, Container, Group, Modal, ScrollArea, Title } from '@mantine/core';
import './App.css';
import { QuizEditor } from './components/quiz-components/quiz-editor';
import { QuizList } from './components/quiz-components/quiz-list';
import { useEffect, useState } from 'react';
import { useDisclosure, useListState } from '@mantine/hooks';
import { Quiz, QuizOverview } from './models/Quiz';
import { createQuiz, deleteQuiz, getAllQuizzes, updateQuiz } from './controllers/quiz-controller';
import { QuizPlayer } from './components/quiz-components/quiz-player';

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
            <Modal opened={opened} onClose={() => { close(); setId(undefined); }} fullScreen scrollAreaComponent={ScrollArea.Autosize}>
                <QuizEditor id={id} closeEditor={closeEditor} />
            </Modal>
            <Modal
                opened={playerModalActive}
                onClose={() => setPlayerModalActive(false)}
                fullScreen
                radius={0}
                transitionProps={{ transition: 'fade', duration: 200 }}>
                    {id && <QuizPlayer id={id} close={() => setPlayerModalActive(false)} />}
            </Modal>
            <Container>
                <Group justify='space-between' mt={32} mb={24}>
                    <Title fw={400} size="h1">Cool Quizzer</Title>
                    <Button variant='subtle' onClick={open}>Add new quiz</Button>
                </Group>
                <QuizList quizzes={quizzes} playQuiz={playQuiz} editQuiz={editQuiz} deleteQuiz={deleteQuizById} />
            </Container>
        </>
    );
}

export default App;
