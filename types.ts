export interface QuestionDetail {
  questionNumber: number;
  studentAnswer: string | null;
  correctAnswer: string;
  status: 'CORRECT' | 'WRONG' | 'UNATTEMPTED';
}

export interface AnalysisResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  totalScore: number;
  details: QuestionDetail[];
}

export enum UploadType {
  STUDENT_SHEET = 'STUDENT_SHEET',
  ANSWER_KEY = 'ANSWER_KEY',
}