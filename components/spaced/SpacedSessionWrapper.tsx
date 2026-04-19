'use client';

import Link from 'next/link';
import { useExamStore } from '@/lib/exam-store';

const DARK_BLUE = '#0F3683';

interface Props {
  children: React.ReactNode;
  doneHref: string;
  quota?: number;
}

/**
 * Wraps the ExamApp with a sticky "Finalizar Revisão" bar at the bottom.
 * The bar only appears after all session questions have been answered.
 */
export default function SpacedSessionWrapper({ children, doneHref, quota }: Props) {
  const answeredCount = useExamStore((s) => Object.keys(s.userAnswers).length);
  const totalQuestions = useExamStore((s) => s.questions.length);

  // Session size is capped at quota; if quota not set, use total
  const sessionSize = quota ?? totalQuestions;
  const allAnswered = sessionSize > 0 && answeredCount >= sessionSize;

  return (
    <div className="pb-24">
      {children}

      {/* Sticky bottom bar — only visible after all session questions are answered */}
      {allAnswered && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6 py-4 pointer-events-none">
          <Link
            href={quota ? `${doneHref}?quota=${quota}` : doneHref}
            className="pointer-events-auto flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-white shadow-lg transition-opacity hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: DARK_BLUE,
              fontFamily: 'Nunito, sans-serif',
              boxShadow: `0 8px 32px ${DARK_BLUE}40`,
            }}
          >
            ✓ Finalizar Revisão
          </Link>
        </div>
      )}
    </div>
  );
}
