import { FC, useEffect, useState } from "react";
import { Container,Select, Text } from "@mantine/core";
import { QUESTION_TYPE_LABEL, Question, QuestionType } from "../../models/questions/Question";
import { NoAnswerQuestion } from "../../models/questions/NoAnswerQuestion";
import { MultipleChoiceQuestion } from "../../models/questions/MultipleChoiceQuestion";
import { MultipleSelectQuestion } from "../../models/questions/MultipleSelectQuestion";
import { ShortAnswerQuestion } from "../../models/questions/ShortAnswerQuestion";

interface Props {
    addQuestion: (question: Question) => void
}

export const NewQuestionEditView: FC<Props> = ({ addQuestion }) => {
    const [type, setType] = useState<string | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        handleTypeChange();
    }, [type])
    
    function handleTypeChange() {
        if(type) {
            const index = QUESTION_TYPE_LABEL.indexOf(type);
            if(index !== undefined && index >= 0 && index < QUESTION_TYPE_LABEL.length) {
                setQuestion(createQuestion(index));
            }
        }else {
            setQuestion(null);
        }
    }

    function createQuestion(type: QuestionType): Question {
        let question: Question = new NoAnswerQuestion();
        switch(type) {
            case QuestionType.MULTIPLE_CHOICE: {
                question = new MultipleChoiceQuestion();
                break;
            }
            case QuestionType.MULTIPLE_SELECT: {
                question = new MultipleSelectQuestion();
                break;
            }
            case QuestionType.SHORT_ANSWER: {
                question = new ShortAnswerQuestion();
                break;
            }
            default: {
                break;
            }
        }
        return question;
    }


    return(
        <Container p={0}>
            <Select 
                label="Question Type"
                placeholder="None selected"
                data={QUESTION_TYPE_LABEL} 
                value={type} 
                allowDeselect={false}
                onChange={setType}
                size="md"
                mb={12} />
            {question === null ? <Text>Select a question type.</Text> : question.getEditView(addQuestion)}
        </Container>
    );
}