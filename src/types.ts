export type CadreType = 'General Cadre Only' | 'General + Technical/Professional Cadre';
export type AcademicBackground =
  | 'Science'
  | 'Engineering'
  | 'Medical'
  | 'Business Studies'
  | 'Humanities'
  | 'Political Science'
  | 'Law'
  | 'Economics'
  | 'Computer Science'
  | 'Other';

export type DailyStudyTime = '2 Hours' | '3 Hours' | '4 Hours' | '5 Hours' | '6 Hours' | '8+ Hours';
export type SubjectName =
  | 'Bangla'
  | 'English'
  | 'Bangladesh Affairs'
  | 'International Affairs'
  | 'Geography / Environment / Disaster Management'
  | 'General Science'
  | 'ICT'
  | 'Mathematical Reasoning'
  | 'Mental Ability'
  | 'Ethics, Values & Good Governance'
  | 'Technical / Professional Subject'
  | 'Written Exam'
  | 'Viva Preparation';

export type ExamType = 'Preliminary' | 'Written' | 'Viva';

export interface Profile {
  id: string;
  name: string;
  cadre: CadreType;
  durationDays: number;
  background: AcademicBackground;
  customBackground?: string;
  dailyStudyTime: DailyStudyTime;
  startDate: string;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  subject: SubjectName;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
}

export type DayStatus = 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'EXAM PASSED' | 'REVIEW REQUIRED';

export interface StudyDay {
  day: number;
  date: string;
  theme: string;
  phase: string;
  tasks: StudyTask[];
  completion: number;
  status: DayStatus;
  examScore?: number;
}

export interface DailyNote {
  learned: string;
  mistakes: string;
  importantFacts: string;
  revise: string;
}

export interface MCQQuestion {
  id: string;
  subject: SubjectName;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ExamAttempt {
  id: string;
  day: number;
  score: number;
  total: number;
  percentage: number;
  correct: number;
  wrong: number;
  submittedAt: string;
  answers: Record<string, string>;
  questions: MCQQuestion[];
}

export interface ErrorLogEntry {
  id: string;
  subject: SubjectName;
  topic: string;
  question: string;
  myAnswer: string;
  correctAnswer: string;
  whyWrong: string;
  revisionDate: string;
  status: 'Unreviewed' | 'Reviewed' | 'Mastered';
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  type: 'question' | 'topic' | 'task' | 'note';
  title: string;
  detail: string;
  tag: string;
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface PYQRecord {
  id: string;
  bcs: string;
  exam: ExamType | 'Preliminary';
  questionNumber: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number | null;
  explanation?: string;
  source?: string;
}

export interface ModelTestConfig {
  type: 'Full MCQ Test' | 'Subject Test' | 'Mixed Test' | 'Previous Year Practice' | 'Timed Test';
  questionCount: 50 | 100 | 200;
}
