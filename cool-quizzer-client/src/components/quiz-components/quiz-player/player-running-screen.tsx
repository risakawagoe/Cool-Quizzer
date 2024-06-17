import { Card, Title } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { QuizConfig } from "./player-config-screen";
import { Question } from "../../../models/questions/Question";

interface Props {
    config: QuizConfig
    question: Question
    index: number
    saveQuestion: (question: Question) => void
}

export const PlayerRunningScreen: FC<Props> = ({ config, question, index, saveQuestion }) => {
    const [currentQuestion, setCurrentQuestion] = useState(question);
    useEffect(() => {
        setCurrentQuestion(question)
        console.log(question)
        console.log(currentQuestion)
    }, [question])

    return (
        <Card withBorder mb={20}>
            <Title size="h3" fw={600} mb={24}>Question {index + 1}</Title>
            {currentQuestion.isMarked() ? currentQuestion.getReviewView(config) : currentQuestion.getTestView(saveQuestion)}
        </Card>
    );
}