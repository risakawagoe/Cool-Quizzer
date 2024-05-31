import { FC } from 'react';
import { Question } from './questions/Question';

export type QuestionProps<T extends Question> = {
  question: T;
  saveQuestion: (question: Question, index: number) => void
}

export type QuestionEditor<T extends Question> = FC<QuestionProps<T>>;