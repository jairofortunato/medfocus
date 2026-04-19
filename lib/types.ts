// TypeScript interfaces for Med Estudo Focado

export interface QuestionImage {
  id: string;
  image_url: string;
  image_type: string;
  display_order: number;
  alt_text?: string;
}

export interface Question {
  id: string; // UUID from Supabase
  numero: number;
  tags: string[];
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
  resposta_correta: 'A' | 'B' | 'C' | 'D' | 'E';
  area?: string;
  explicacao: string;
  images?: QuestionImage[];
  examNome?: string;
  examAno?: number;
}

export interface ExamData {
  prova: string;
  total_questoes: number;
  questoes: Question[];
}

export interface ExamInfo {
  id: string;
  slug: string;
  nome: string;
  ano: number;
  total_questoes: number;
  is_active: boolean;
}

// Keys are question UUIDs
export type UserAnswers = Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;

export interface TagStatistic {
  tag: string;
  total: number;
  answered: number;
  correct: number;
  percentage: number;
}

export interface TimerState {
  timeRemaining: number; // in seconds
  isRunning: boolean;
}

export type TabType = 'timer' | 'stats';

export interface ExamState {
  // Exam metadata
  examId: string | null;
  examSlug: string | null;

  // Question state
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers;

  // Timer state
  timer: TimerState;

  // Session state
  sessionId: string | null;

  // Auth state
  userId: string | null;

  // UI state
  currentTab: TabType;
  isSyncing: boolean;

  // Actions
  setExam: (examId: string, examSlug: string) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  selectAnswer: (questionId: string, answer: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  loadUserAnswers: (answers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>) => void;

  // Auth actions
  setUserId: (userId: string | null) => void;

  // Session actions
  setSessionId: (sessionId: string | null) => void;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;

  // UI actions
  switchTab: (tab: TabType) => void;
  setSyncing: (syncing: boolean) => void;

  // Computed values
  getCorrectCount: () => number;
  getAnsweredCount: () => number;
  getProgressPercentage: () => number;
  getTagStatistics: () => TagStatistic[];
  getCurrentQuestion: () => Question | undefined;
}
