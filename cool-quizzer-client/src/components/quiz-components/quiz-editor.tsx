import { FC, useEffect, useState } from "react";
import { Quiz } from "../../models/Quiz";
import { Button, Container, Group, LoadingOverlay, Modal, ScrollArea, TextInput, Textarea, Title } from "@mantine/core";
import { IconSquarePlus } from "@tabler/icons-react";
import { QuestionsList } from "./questions-list";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { NewQuestionEditView } from "./new-question-edit-view";
import { Question } from "../../models/questions/Question";
import { createQuiz, getQuiz, updateQuiz } from "../../controllers/quiz-controller";

interface Props {
    id: string | undefined
    closeEditor: () => void
}

export const QuizEditor: FC<Props> = ({ id, closeEditor }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalElement, setModalElement] = useState(<></>);
    const [quiz, setQuiz] = useState(new Quiz());

    const [title, setTitle] = useInputState('');
    const [description, setDescription] = useInputState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, []);

    

    useEffect(() => {
        setTitle(quiz.getTitle());
        setDescription(quiz.getDescription());
    }, [quiz]);

    
    async function fetchQuiz() {
        if(id) {
            setLoading(true);
            const result = await getQuiz(id);
            const data = result.data;
            if(result.success && data) {
                setQuiz(data);
            }else {
                alert('Sorry.. Something went wrong, please try again later.');
                close();
            }
            setLoading(false);
        }
    }



    function updateTitle(title: string) {
        setTitle(title);
        quiz.setTitle(title);
        setQuiz(quiz);
    }
    function updateDescription(description: string) {
        setDescription(description);
        quiz.setDescription(description);
        setQuiz(quiz);
    }

    function openModal(title: string, element: JSX.Element): void {
        setModalTitle(title);
        setModalElement(element);
        open();
    }

    function addQuestion(question: Question) {
        quiz.addQuestion(question);
        setQuiz(quiz);
        close();
    }

    function removeQuestion(index: number) {
        quiz.removeQuestion(index);
        setQuiz(quiz);
    }
    
    function updateQuestion(question: Question, index: number) {
        saveLiveChanges(question, index);
        close();
    }
    
    function saveLiveChanges(question: Question, index: number) {
        quiz.updateQuestion(question, index);
        setQuiz(quiz);
    }

    async function saveQuiz() {
        setLoading(true);
        updateTitle(title);
        updateDescription(description);

        const success = id ? await updateQuiz(id, quiz) : await createQuiz(quiz);
        setLoading(false);
        if(success) {
            closeEditor();
        }else {
            alert('Sorry.. Something went wrong, Please try again later.');
        }
    }

    return(
        <>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'cyan', type: 'bars' }}
            />
            <Modal opened={opened} onClose={close} size="xl" scrollAreaComponent={ScrollArea.Autosize} title={modalTitle}>
                {modalElement}
            </Modal>
            <Container mb={20}>
                <Title size="h1" fw={400} mt={20} mb={12} c="cyan">Quiz Editor</Title>
                <TextInput 
                    label="Title"
                    value={title}
                    onChange={setTitle}
                    required
                />
                <Textarea 
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    autosize
                />
            </Container>
            <Container p={16}>
                <Group mb={20} justify="space-between" align="center">
                    <Title size="h2" fw={400} c="cyan">Questions</Title>
                    <Button onClick={() => openModal('New Question', <NewQuestionEditView addQuestion={addQuestion} />)} variant="subtle" leftSection={<IconSquarePlus style={{ width: '100%', height: '100%' }} stroke={1} />}>Add new question</Button>
                </Group>
                <QuestionsList questions={[...quiz.getQuestions()]} openModal={openModal} saveQuestion={updateQuestion} removeQuestion={removeQuestion} saveLiveChanges={saveLiveChanges} />
                <Group justify="flex-end" mt={24}>
                    <Button variant="outline" onClick={saveQuiz}>Save Quiz</Button>
                </Group>
            </Container>
         </>
    );
}