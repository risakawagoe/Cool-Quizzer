import { FC } from 'react';
import { Question } from './questions/Question';
import { QuizConfig } from '../components/quiz-components/quiz-player/player-config-screen';

export type QuestionReviewerProps<T extends Question> = {
    config: QuizConfig
    question: T;
}

export type QuestionReviewer<T extends Question> = FC<QuestionReviewerProps<T>>;