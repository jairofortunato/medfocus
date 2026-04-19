'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useExamStore } from '@/lib/exam-store';
import { createClient } from '@/lib/supabase/client';
import { insertUserAnswer, upsertUserProgress, createStudySession, endStudySession } from '@/lib/supabase/queries';
import type { Question } from '@/lib/types';
import ProgressStats from './header/ProgressStats';
import QuestionCard from './exam/QuestionCard';
import Link from 'next/link';

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

  // Zustand store ref to avoid hydration mismatch
  const initialized = useRef(false);

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

  // Initialize on mount (once)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setExam(examId, examSlug);
    setUserId(userId);
    setQuestions(questions);
    loadUserAnswers(initialAnswers);
    setCurrentQuestion(initialQuestionIndex);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Save progress on navigation changes (only for real exams, not area/random modes)
  const isRealExam = !examId.startsWith('area-') && !examId.startsWith('topico-') && !examId.startsWith('spaced-') && examId !== 'random';
  const saveProgress = useCallback(async () => {
    if (!isRealExam) return;
    const state = useExamStore.getState();
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      await upsertUserProgress(supabase, userId, examId, currentQuestion.numero);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [supabase, userId, examId, isRealExam]);

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

  // Start study session when timer starts (only for real exams)
  useEffect(() => {
    if (timer.isRunning && !sessionId && isRealExam) {
      createStudySession(supabase, {
        userId,
        examId,
        sessionType: 'pomodoro',
        plannedDurationSecs: 1500,
      })
        .then((session) => setSessionId(session.id))
        .catch(console.error);
    }
  }, [timer.isRunning, sessionId, supabase, userId, examId, setSessionId, isRealExam]);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswers = useExamStore((s) => s.userAnswers);
  const nextQuestion = useExamStore((s) => s.nextQuestion);
  const prevQuestion = useExamStore((s) => s.prevQuestion);
  const questionsArr = useExamStore((s) => s.questions);
  const isAnswered = currentQuestion ? !!userAnswers[currentQuestion.id] : false;
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questionsArr.length - 1;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500 text-lg">Carregando questoes...</div>
      </div>
    );
  }

  const DARK_BLUE = '#0F3683';

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 relative z-10">
      {/* Top bar: back to menu + nav arrows + progress */}
      <div className="glass-header px-5 py-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          {/* Left: back + stats */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-slate-600 transition-colors text-sm"
            >
              ← Voltar
            </Link>
            <Link
              href={`/exam/${examSlug}/stats`}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
              style={{ backgroundColor: `${DARK_BLUE}10`, color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Estatísticas
            </Link>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevQuestion}
              disabled={isFirst}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30"
              style={{ backgroundColor: `${DARK_BLUE}10`, color: DARK_BLUE }}
              title="Questão anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span
              className="text-sm font-black min-w-[80px] text-center"
              style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
            >
              {currentQuestionIndex + 1} / {questionsArr.length}
            </span>

            <button
              onClick={nextQuestion}
              disabled={isLast}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30"
              style={{ backgroundColor: `${DARK_BLUE}10`, color: DARK_BLUE }}
              title="Próxima questão"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
        <ProgressStats />
      </div>

      <QuestionCard question={currentQuestion} questionIndex={currentQuestionIndex} examNome={examNome} />

      {/* Floating Next button - appears after answering */}
      {isAnswered && !isLast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 floating-next-enter">
          <button
            onClick={nextQuestion}
            className="text-lg px-10 py-4 shadow-2xl rounded-2xl font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: DARK_BLUE }}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
