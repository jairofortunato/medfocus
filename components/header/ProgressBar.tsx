'use client';

import { useExamStore } from '@/lib/exam-store';

export default function ProgressBar() {
  const getProgressPercentage = useExamStore((state) => state.getProgressPercentage);
  const percentage = getProgressPercentage();

  return (
    <div className="bg-slate-400/20 h-2 rounded-full mb-3 overflow-hidden">
      <div
        className="gradient-progress h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
