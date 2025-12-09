export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  JUDGMENT = 'JUDGMENT',
  MNEMONIC = 'MNEMONIC'
}

export interface Question {
  id: string;
  type: QuestionType;
  category: string; // e.g., "第一小节", "知识点"
  question: string; // The question text or the knowledge point name
  options?: string[]; // For choices
  answer: string; // Correct answer key (A, B, C...) or 'T'/'F' or full text
  mnemonic?: string; // For short answers/flashcards (口诀)
  explanation?: string; // Detailed explanation or full text for short answer
}

export interface UserProgress {
  wrongQuestionIds: string[];
  completedQuestionIds: string[];
}