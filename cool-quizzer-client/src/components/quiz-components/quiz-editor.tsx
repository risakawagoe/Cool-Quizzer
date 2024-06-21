import { FC, useEffect, useState } from "react";
import { Quiz, QuizStats } from "../../models/Quiz";
import { Button, Container, Group, LoadingOverlay, Modal, ScrollArea, TextInput, Textarea, Title } from "@mantine/core";
import { IconSquarePlus } from "@tabler/icons-react";
import { QuestionsList } from "./questions-list";
import { useDisclosure, useInputState, useListState } from "@mantine/hooks";
import { NewQuestionEditView } from "./new-question-edit-view";
import { Question } from "../../models/questions/Question";
import { createQuiz, getQuiz, updateQuiz } from "../../controllers/quiz-controller";

interface Props {
    id: string | undefined
    closeEditor: () => void
    changed: () => void
}

export const QuizEditor: FC<Props> = ({ id, closeEditor, changed }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalElement, setModalElement] = useState(<></>);

    const [title, setTitle] = useInputState('');
    const [description, setDescription] = useInputState('');
    const [questions, questionsHandlers] = useListState<Question>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<QuizStats>();

    useEffect(() => {
        fetchQuiz();
    }, []);

    
    async function fetchQuiz() {
        if(id !== undefined) {
            setLoading(true);
            const result = await getQuiz(id);
            const quiz = result.data;
            if(result.success && quiz) {
                setTitle(quiz.getTitle());
                setDescription(quiz.getDescription());
                questionsHandlers.setState([...quiz.getQuestions()]);
                setStats(quiz.getStats());
            }else {
                alert('Sorry.. Something went wrong, please try again later.');
                close();
            }
            setLoading(false);
        }
    }

    function openModal(title: string, element: JSX.Element): void {
        setModalTitle(title);
        setModalElement(element);
        open();
    }

    function addQuestion(question: Question) {
        questionsHandlers.append(question);
        close();
    }

    function removeQuestion(index: number) {
        questionsHandlers.remove(index);
    }
    
    function updateQuestion(question: Question, index: number) {
        saveLiveChanges(question, index);
        close();
    }
    
    function saveLiveChanges(question: Question, index: number) {
        questionsHandlers.setItem(index, question);
    }

    async function saveQuiz() {
        const quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setQuestions(questions);
        if(stats) {
            quiz.setStats(stats);
        }
        
        setLoading(true);
        const success = id ? await updateQuiz(id, quiz) : await createQuiz(quiz);
        setLoading(false);
        if(success) {
            changed();
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
            <Container p={0} mb={32}>
                <Title size="h1" fw={400} mb={12} c="cyan">Quiz Editor</Title>
                <TextInput 
                    label="Title"
                    value={title}
                    onChange={setTitle}
                    size="md"
                    required
                    />
                <Textarea 
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    size="md"
                    mt={12}
                    autosize
                />
            </Container>
            <Container p={0}>
                <Group mb={20} justify="space-between" align="center">
                    <Title size="h2" fw={400} c="cyan">Questions</Title>
                    <Button onClick={() => openModal('New Question', <NewQuestionEditView addQuestion={addQuestion} />)} variant="subtle" leftSection={<IconSquarePlus style={{ width: '100%', height: '100%' }} stroke={1} />}>Add new question</Button>
                </Group>
                <QuestionsList questions={questions} openModal={openModal} saveQuestion={updateQuestion} removeQuestion={removeQuestion} saveLiveChanges={saveLiveChanges} />
                <Group justify="flex-end" mt={24}>
                    <Button variant="outline" onClick={saveQuiz} disabled={title.trim().length === 0 || questions.length === 0}>Save Quiz</Button>
                </Group>
            </Container>
         </>
    );
}