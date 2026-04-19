'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/lib/exam-store';

export default function ProgressStats() {
  const [mounted, setMounted] = useState(false);
  const questions = useExamStore((state) => state.questions);
  const getAnsweredCount = useExamStore((state) => state.getAnsweredCount);
  const getCorrectCount = useExamStore((state) => state.getCorrectCount);

  useEffect(() => { setMounted(true); }, []);

  const answeredCount = mounted ? getAnsweredCount() : 0;
  const correctCount = mounted ? getCorrectCount() : 0;
  const totalCount = mounted ? questions.length : 0;

  return (
    <div className="flex justify-between items-center">
      <div className="text-slate-500 text-base font-medium">
        Respondidas: {answeredCount}/{totalCount}
      </div>
      <div
        className="text-base font-black px-3 py-1 rounded-full"
        style={{ color: '#E292BE', backgroundColor: 'rgba(226,146,190,0.12)', fontFamily: 'Nunito, sans-serif' }}
      >
        Acertos: {correctCount}
      </div>
    </div>
  );
}
