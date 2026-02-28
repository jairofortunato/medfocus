import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamState, Question, TabType, TagStatistic } from './types';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      examId: null,
      examSlug: null,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timer: {
        timeRemaining: POMODORO_DURATION,
        isRunning: false,
      },
      sessionId: null,
      userId: null,
      currentTab: 'timer',
      isSyncing: false,
      pendingReward: null,

      // Exam actions
      setExam: (examId: string, examSlug: string) => set({ examId, examSlug }),

      // Question actions
      setQuestions: (questions: Question[]) => set({ questions }),

      setCurrentQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      selectAnswer: (questionId: string, answer: 'A' | 'B' | 'C' | 'D' | 'E') => {
        const { userAnswers, questions } = get();
        // Lock answer - prevent changes once answered
        if (userAnswers[questionId]) {
          return;
        }

        const correctCountBefore = get().getCorrectCount();
        const question = questions.find((q) => q.id === questionId);
        const isCorrect = question && answer === question.resposta_correta;

        set({
          userAnswers: {
            ...userAnswers,
            [questionId]: answer,
          },
        });

        // Trigger reward popup for correct answers
        if (isCorrect) {
          const correctCountNow = correctCountBefore + 1;
          const MILESTONES = [
            { at: 10, amount: 50 },
            { at: 20, amount: 75 },
            { at: 30, amount: 100 },
          ];
          const newMilestones = MILESTONES.filter(
            (m) => correctCountBefore < m.at && correctCountNow >= m.at
          );
          set({
            pendingReward: { amount: 10, milestones: newMilestones },
          });
        }
      },

      loadUserAnswers: (answers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>) => {
        set({ userAnswers: answers });
      },

      // Auth actions
      setUserId: (userId: string | null) => set({ userId }),

      // Session actions
      setSessionId: (sessionId: string | null) => set({ sessionId }),

      // Timer actions
      startTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: true },
      })),

      pauseTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: false },
      })),

      resetTimer: () => set({
        timer: { timeRemaining: POMODORO_DURATION, isRunning: false },
      }),

      tick: () => set((state) => ({
        timer: {
          ...state.timer,
          timeRemaining: Math.max(0, state.timer.timeRemaining - 1),
        },
      })),

      // UI actions
      switchTab: (tab: TabType) => set({ currentTab: tab }),
      setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),
      clearReward: () => set({ pendingReward: null }),

      // Computed values
      getCorrectCount: () => {
        const { questions, userAnswers } = get();
        return questions.filter(
          (q) => userAnswers[q.id] && userAnswers[q.id] === q.resposta_correta
        ).length;
      },

      getAnsweredCount: () => {
        const { userAnswers } = get();
        return Object.keys(userAnswers).length;
      },

      getProgressPercentage: () => {
        const { questions } = get();
        const answeredCount = get().getAnsweredCount();
        return questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
      },

      getTagStatistics: (): TagStatistic[] => {
        const { questions, userAnswers } = get();
        const statsMap: Record<string, { total: number; answered: number; correct: number }> = {};

        questions.forEach((question) => {
          question.tags.forEach((tag) => {
            if (!statsMap[tag]) {
              statsMap[tag] = { total: 0, answered: 0, correct: 0 };
            }
            statsMap[tag].total++;

            if (userAnswers[question.id]) {
              statsMap[tag].answered++;
              if (userAnswers[question.id] === question.resposta_correta) {
                statsMap[tag].correct++;
              }
            }
          });
        });

        return Object.entries(statsMap)
          .map(([tag, stats]) => ({
            tag,
            ...stats,
            percentage: stats.answered > 0 ? (stats.correct / stats.answered) * 100 : 0,
          }))
          .sort((a, b) => b.percentage - a.percentage);
      },

      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex];
      },

      getDinheiros: () => {
        const correctCount = get().getCorrectCount();
        let total = correctCount * 10;
        if (correctCount >= 10) total += 50;
        if (correctCount >= 20) total += 75;
        if (correctCount >= 30) total += 100;
        return total;
      },

      getDinheirosBreakdown: () => {
        const correctCount = get().getCorrectCount();
        return {
          base: correctCount * 10,
          bonuses: [
            { at: 10, amount: 50, earned: correctCount >= 10 },
            { at: 20, amount: 75, earned: correctCount >= 20 },
            { at: 30, amount: 100, earned: correctCount >= 30 },
          ],
        };
      },
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        // Only persist these fields (localStorage as offline cache)
        currentQuestionIndex: state.currentQuestionIndex,
        userAnswers: state.userAnswers,
        examId: state.examId,
        examSlug: state.examSlug,
      }),
    }
  )
);
