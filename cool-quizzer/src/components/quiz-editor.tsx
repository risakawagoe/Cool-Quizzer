import { FC } from "react";
import { Quiz } from "../models/Quiz";
import { QuestionEditor } from "../models/QuestionEditor";
import { ShortAnswerEditor } from "./question-editors/short-answer-editor";

export const QuizEditor: FC = () => {
    const quiz: Quiz = new Quiz();
    return(
        <>
        <h1>Quiz Editor</h1>
        {quiz.displayEditors()}
        </>
    );
}