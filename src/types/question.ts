type QuestionBase = {
  id: number;
  topic: string;
  text: string;
};

export type SingleChoiceQuestion = QuestionBase & {
  type: 'single';
  options: { id: number; text: string }[];
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: 'multiple';
  options: { id: number; text: string }[];
};

export type TextQuestion = QuestionBase & {
  type: 'text';
};

export type LetterClickQuestion = QuestionBase & {
  type: 'letter_click';
  word: string;
};

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TextQuestion
  | LetterClickQuestion;

export type Answer =
  | { type: 'single'; questionId: number; optionId: number }
  | { type: 'multiple'; questionId: number; optionIds: number[] }
  | { type: 'text'; questionId: number; value: string }
  | { type: 'letter_click'; questionId: number; position: number };

export type QuestionResult = {
  questionId: number;
  isCorrect: boolean;
};
