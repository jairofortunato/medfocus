'use client';

import { useEffect, useCallback } from 'react';
import { useExamStore } from '@/lib/exam-store';
import { createClient } from '@/lib/supabase/client';
import { insertUserAnswer, upsertUserProgress, createStudySession, endStudySession } from '@/lib/supabase/queries';
import type { Question } from '@/lib/types';
import ProgressStats from './header/ProgressStats';
import QuestionCard from './exam/QuestionCard';
import RewardPopup from './exam/RewardPopup';

interface ExamAppProps {
  questions: Question[];
  examId: string;
  examSlug: string;
  examNome: string;
  userId: string;
  initialAnswers?: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
  initialQuestionIndex?: number;
}

export default function ExamApp({
  questions,
  examId,
  examSlug,
  examNome,
  userId,
  initialAnswers = {},
  initialQuestionIndex = 0,
}: ExamAppProps) {
  const {
    currentQuestionIndex,
    timer,
    sessionId,
    setQuestions,
    setExam,
    setUserId,
    setCurrentQuestion,
    loadUserAnswers,
    pauseTimer,
    resetTimer,
    tick,
    setSessionId,
  } = useExamStore();

  const supabase = createClient();

  // Initialize on mount
  useEffect(() => {
    setExam(examId, examSlug);
    setUserId(userId);
    setQuestions(questions);
    loadUserAnswers(initialAnswers);
    setCurrentQuestion(initialQuestionIndex);
  }, [examId, examSlug, userId, questions, initialAnswers, initialQuestionIndex, setExam, setUserId, setQuestions, loadUserAnswers, setCurrentQuestion]);

  // Subscribe to answer changes for Supabase sync
  useEffect(() => {
    const unsub = useExamStore.subscribe(
      (state, prevState) => {
        // Detect new answers
        const newKeys = Object.keys(state.userAnswers).filter(
          (key) => !prevState.userAnswers[key]
        );

        newKeys.forEach(async (questionId) => {
          const answer = state.userAnswers[questionId];
          const question = state.questions.find((q) => q.id === questionId);
          if (!question || !answer) return;

          try {
            await insertUserAnswer(supabase, {
              userId,
              questionId,
              selectedAnswer: answer,
              isCorrect: answer === question.resposta_correta,
              sessionId: state.sessionId ?? undefined,
            });
          } catch (err: any) {
            // UNIQUE violation means already synced - ignore
            if (err?.code !== '23505') {
              console.error('Failed to sync answer:', err);
            }
          }
        });
      }
    );
    return () => unsub();
  }, [supabase, userId]);

  // Save progress on navigation changes
  const saveProgress = useCallback(async () => {
    const state = useExamStore.getState();
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      await upsertUserProgress(supabase, userId, examId, currentQuestion.numero);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [supabase, userId, examId]);

  useEffect(() => {
    // Debounce progress saves
    const timeout = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, saveProgress]);

  // Timer interval management
  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      const currentTime = useExamStore.getState().timer.timeRemaining;

      if (currentTime <= 0) {
        pauseTimer();
        // End session as completed
        const sid = useExamStore.getState().sessionId;
        if (sid) {
          const state = useExamStore.getState();
          endStudySession(supabase, sid, {
            actualDurationSecs: 1500,
            questionsAnswered: state.getAnsweredCount(),
            questionsCorrect: state.getCorrectCount(),
            completed: true,
          }).catch(console.error);
          setSessionId(null);
        }
        alert('Tempo esgotado! Hora de fazer uma pausa de 5 minutos.');
        resetTimer();
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, pauseTimer, resetTimer, tick, supabase, setSessionId]);

  // Start study session when timer starts
  useEffect(() => {
    if (timer.isRunning && !sessionId) {
      createStudySession(supabase, {
        userId,
        examId,
        sessionType: 'pomodoro',
        plannedDurationSecs: 1500,
      })
        .then((session) => setSessionId(session.id))
        .catch(console.error);
    }
  }, [timer.isRunning, sessionId, supabase, userId, examId, setSessionId]);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswers = useExamStore((s) => s.userAnswers);
  const nextQuestion = useExamStore((s) => s.nextQuestion);
  const questionsArr = useExamStore((s) => s.questions);
  const isAnswered = currentQuestion ? !!userAnswers[currentQuestion.id] : false;
  const isLast = currentQuestionIndex === questionsArr.length - 1;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500 text-lg">Carregando questoes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 relative z-10">
      {/* Minimal stats header */}
      <div className="glass-header px-6 py-3 mb-6">
        <ProgressStats />
      </div>

      <QuestionCard question={currentQuestion} questionIndex={currentQuestionIndex} />

      {/* Reward popup bubble */}
      <RewardPopup />

      {/* Floating Next button - appears after answering */}
      {isAnswered && !isLast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 floating-next-enter">
          <button
            onClick={nextQuestion}
            className="gradient-btn text-lg px-10 py-4 shadow-2xl"
          >
            Proxima →
          </button>
        </div>
      )}
    </div>
  );
}
