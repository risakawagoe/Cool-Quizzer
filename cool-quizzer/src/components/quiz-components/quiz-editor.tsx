import { FC, useEffect, useState } from "react";
import { Quiz } from "../../models/Quiz";
import { Button, Container, Group, LoadingOverlay, Modal, ScrollArea, TextInput, Textarea, Title } from "@mantine/core";
import { ShortAnswerQuestion } from "../../models/questions/ShortAnswerQuestion";
import { MultipleChoiceQuestion } from "../../models/questions/MultipleChoiceQuestion";
import { MultipleSelectQuestion } from "../../models/questions/MultipleSelectQuestion";
import { IconSquarePlus } from "@tabler/icons-react";
import { QuestionsList } from "./questions-list";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { NoAnswerQuestion } from "../../models/questions/NoAnswerQuestion";
import { NewQuestionEditView } from "./new-question-edit-view";
import { Question } from "../../models/questions/Question";
// import { QuizPlayer } from "./quiz-player";
import { createQuiz, getQuiz, updateQuiz } from "../../controllers/quiz-controller";

interface Props {
    id: string | undefined
    // saveQuiz: (quiz: Quiz) => void
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
    }, [])

    function loadDemo() {
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

        // demoQuiz.addQuestion(short);
        // demoQuiz.addQuestion(mc);
        // demoQuiz.addQuestion(short2);
        // demoQuiz.addQuestion(noAns);
        // demoQuiz.addQuestion(ms);

        // sample questions
        let demo_mc1 = new MultipleChoiceQuestion();
        demo_mc1.setPrompt("Which of the following Biomolecules simply refers to as “Staff of life”?");
        demo_mc1.setOptions(["Lipids", "Proteins", "Vitamins", "Carbohydrates"]);
        demo_mc1.setAnswers(3);
        
        let demo_mc2 = new MultipleChoiceQuestion();
        demo_mc2.setPrompt("Which of the following is the simplest form of carbohydrates?");
        demo_mc2.setOptions(["Carboxyl groups", "Aldehyde and Ketone groups", "Alcohol and Carboxyl groups", "Hydroxyl groups and Hydrogen groups"]);
        demo_mc2.setAnswers(3);

        let demo_mc3 = new MultipleChoiceQuestion();
        demo_mc3.setPrompt("Which of the following monosaccharides is the majority found in the human body?");
        demo_mc3.setOptions(["D-type", "L-type", "LD-types", "None of the above"]);
        demo_mc3.setAnswers(0);

        let demo_mc4 = new MultipleChoiceQuestion();
        demo_mc4.setPrompt("Which of the following is the most abundant biomolecule on the earth?");
        demo_mc4.setOptions(["Lipids", "Proteins", "Carbohydrates", "Nucleic acids."]);
        demo_mc4.setAnswers(2);

        let demo_mc5 = new MultipleChoiceQuestion();
        demo_mc5.setPrompt("Which of the following are the major functions of Carbohydrates?");
        demo_mc5.setOptions(["Storage", "Structural framework", "Transport Materials", "Both Storage and structural framework"]);
        demo_mc5.setAnswers(3);

        let demo_mc6 = new MultipleChoiceQuestion();
        demo_mc6.setPrompt("Which of the following is the general formula of Carbohydrates?");
        demo_mc6.setOptions(["a", "b", "c", "d"]);
        demo_mc6.setAnswers(2);

        let demo_mc7 = new MultipleChoiceQuestion();
        demo_mc7.setPrompt("Molisch test is used for _________.");
        demo_mc7.setOptions(["Lipids", "Proteins", "Mucoproteins", "Flavoproteins"]);
        demo_mc7.setAnswers(2);

        let demo_mc8 = new MultipleChoiceQuestion();
        demo_mc8.setPrompt("Which of the following is an example of Epimers?");
        demo_mc8.setOptions(["Glucose and Ribose", "Glucose and Galactose", "Galactose, Mannose and Glucose", "Glucose, Ribose and Mannose"]);
        demo_mc8.setAnswers(1);

        let demo_mc9 = new MultipleChoiceQuestion();
        demo_mc9.setPrompt("Which of the following has reducing properties?");
        demo_mc9.setOptions(["Mucic acid", "Glucaric acid", "Gluconic acid", "Glucuronic acid"]);
        demo_mc9.setAnswers(3);

        demoQuiz.addQuestion(demo_mc1);
        demoQuiz.addQuestion(demo_mc2);
        demoQuiz.addQuestion(demo_mc3);
        demoQuiz.addQuestion(demo_mc4);
        demoQuiz.addQuestion(demo_mc5);
        demoQuiz.addQuestion(demo_mc6);
        demoQuiz.addQuestion(demo_mc7);
        demoQuiz.addQuestion(demo_mc8);
        demoQuiz.addQuestion(demo_mc9);

        setQuiz(demoQuiz);
    }

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
                // questionsHandlers.setState(data.getQuestions());
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
        console.log('saveing!')
        setLoading(true);
        updateTitle(title);
        updateDescription(description);

        const result = id ? await updateQuiz(id, quiz) : await createQuiz(quiz);
        setLoading(false);
        if(result.success) {
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
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
            <Modal opened={opened} onClose={close} size="xl" scrollAreaComponent={ScrollArea.Autosize} title={modalTitle}>
                {modalElement}
            </Modal>
            <Container mb={20}>
                <Title size="h1" fw={400} mt={20} mb={12} c="blue">Quiz Editor</Title>
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
                    <Title size="h2" fw={400} c="blue">Questions</Title>
                    <Button onClick={() => openModal('New Question', <NewQuestionEditView addQuestion={addQuestion} />)} variant="transparent" rightSection={<IconSquarePlus style={{ width: '100%', height: '100%' }} stroke={1} />}>Add new question</Button>
                </Group>
                <QuestionsList questions={[...quiz.getQuestions()]} openModal={openModal} saveQuestion={updateQuestion} removeQuestion={removeQuestion} saveLiveChanges={saveLiveChanges} />
            </Container>
            <Group p={16} justify="flex-end">
                <Button variant="outline" onClick={saveQuiz}>Save Quiz</Button>
            </Group>
         </>
    );
}