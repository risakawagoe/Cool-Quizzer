import { Box, Button, Group, Modal, ScrollArea, Title } from '@mantine/core';
import './App.css';
import { QuizEditor } from './components/quiz-components/quiz-editor';
import { QuizList } from './components/quiz-components/quiz-list';
import { useEffect, useState } from 'react';
import { useDisclosure, useListState } from '@mantine/hooks';
import { Quiz, QuizOverview } from './models/Quiz';

function App() {
    const [opened, { open, close }] = useDisclosure(false);
    const [id, setId] = useState<string | undefined>(undefined);
    const [quizzes, handlers] = useListState<QuizOverview>([]);

    useEffect(()  => {
        // get list from database/backend
    })

    function saveQuiz(id: string | undefined, quiz: Quiz) {
        // save or update database
        // if new quiz then record the id returned and add to list
        // close modal
        // set id to undefined
    }
    return (
        <>
            <Modal opened={opened} onClose={close} fullScreen scrollAreaComponent={ScrollArea.Autosize}>
                <QuizEditor id={id} saveQuiz={saveQuiz} />
            </Modal>
            <Box>
                <Group justify='space-between'>
                    <Title>Quizzes</Title>
                    <Button variant='subtle' onClick={open}>Add new quiz</Button>
                </Group>
                <QuizList quizzes={quizzes} />
            </Box>
        </>
    );
}

export default App;
