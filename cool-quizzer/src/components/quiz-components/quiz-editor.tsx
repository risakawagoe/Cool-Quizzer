import { FC, useEffect, useState } from "react";
import { Quiz } from "../../models/Quiz";
import { Button, Container, Flex, Group, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { ShortAnswerQuestion } from "../../models/questions/ShortAnswerQuestion";
import { MultipleChoiceQuestion } from "../../models/questions/MultipleChoiceQuestion";
import { MultipleSelectQuestion } from "../../models/questions/MultipleSelectQuestion";
import { IconSquarePlus } from "@tabler/icons-react";
import { QuestionsList } from "./quiz-list";
import { useDisclosure } from "@mantine/hooks";
import { NoAnswerQuestion } from "../../models/questions/NoAnswerQuestion";
import { NewQuestionEditView } from "./new-question-edit-view";
import { Question } from "../../models/questions/Question";

export const QuizEditor: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalElement, setModalElement] = useState(<></>);
    const [quiz, setQuiz] = useState(new Quiz());

    useEffect(() => {
        const demoQuiz = new Quiz();

        // short asnwer
        let short = new ShortAnswerQuestion();
        short.setPrompt("what is your name?");
        short.setAnswers("Your Name");
        
        // short asnwer
        let short2 = new ShortAnswerQuestion();
        short2.setPrompt("Long question title. What was the name of the possessed hotel in Steven King’s novel (and movie) The Shining, based on the real-life Stanley Hotel in Colorado?");
        short2.setAnswers("The Overlook Hotel");
        
        // MC
        let mc = new MultipleChoiceQuestion();
        mc.setPrompt("Which color is the color of a tomato?");
        mc.setOptions(['red', 'blue', 'green']);
        mc.setAnswers(0);
        
        // no asnwer
        let noAns = new NoAnswerQuestion();
        noAns.setPrompt("Do the following actiovities with your peers.");
        
        // MS
        let ms = new MultipleSelectQuestion();
        ms.setPrompt("Select all that apply.");
        ms.setAnswers([
            {label: "tomato is red", isCorrect: true},
            {label: "the opcean is white", isCorrect: false},
            {label: "water is clear", isCorrect: false},
            {label: "tree leafs are usually green", isCorrect: true}
        ])

        demoQuiz.addQuestion(short);
        demoQuiz.addQuestion(mc);
        demoQuiz.addQuestion(short2);
        demoQuiz.addQuestion(noAns);
        demoQuiz.addQuestion(ms);

        setQuiz(demoQuiz);
    }, [])

    const openModal = (title: string, element: JSX.Element): void => {
        setModalTitle(title);
        setModalElement(element);
        open();
    }

    function addQuestion(question: Question) {
        console.log('addQuestion() in quiz-editor.tsx')
        quiz.addQuestion(question);
        setQuiz(quiz);
        close();
    }
    
    function updateQuestion(question: Question, index: number) {
        console.log('updateQuestion() in quiz-editor.tsx')
        quiz.updateQuestion(question, index);
        setQuiz(quiz);
        close();
    }

    return(
        <>
            <Modal opened={opened} onClose={close} size="xl" scrollAreaComponent={ScrollArea.Autosize} title={modalTitle}>
                {modalElement}
            </Modal>
            <Container p={16}>
                <Group mb={20} justify="space-between" align="center">
                    <Title size="h1">Questions</Title>
                    <Button onClick={() => openModal('New Question', <NewQuestionEditView addQuestion={addQuestion} />)} variant="transparent" rightSection={<IconSquarePlus style={{ width: '100%', height: '100%' }} stroke={1} />}>Add new question</Button>
                </Group>
                <QuestionsList questions={[...quiz.getQuestions()]} openModal={openModal} saveQuestion={updateQuestion} />
            </Container>
         </>
    );
}