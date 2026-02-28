'use client';

import { useExamStore } from '@/lib/exam-store';

export default function ProgressStats() {
  const questions = useExamStore((state) => state.questions);
  const getAnsweredCount = useExamStore((state) => state.getAnsweredCount);
  const getCorrectCount = useExamStore((state) => state.getCorrectCount);
  const getDinheiros = useExamStore((state) => state.getDinheiros);

  const answeredCount = getAnsweredCount();
  const correctCount = getCorrectCount();
  const totalCount = questions.length;
  const dinheiros = getDinheiros();

  return (
    <div className="flex justify-between items-center">
      <div className="text-slate-500 text-base font-medium">
        Respondidas: {answeredCount}/{totalCount}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="dinheiros-badge">
          <span className="dinheiros-icon">$</span>
          {dinheiros}
        </div>
        <div className="text-emerald-500 text-base font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
          Acertos: {correctCount}
        </div>
      </div>
    </div>
  );
}
