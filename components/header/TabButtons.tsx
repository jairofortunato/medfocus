'use client';

import Link from 'next/link';
import { useExamStore } from '@/lib/exam-store';
import { cn } from '@/lib/utils';

export default function TabButtons() {
  const { currentTab, switchTab, examSlug } = useExamStore();

  return (
    <div className="flex justify-center gap-3 mb-5">
      <button
        onClick={() => switchTab('timer')}
        className={cn('tab-btn', currentTab === 'timer' && 'active')}
      >
        ⏰ Timer
      </button>
      <Link
        href={`/exam/${examSlug}/stats`}
        className={cn('tab-btn')}
      >
        📊 Estatísticas
      </Link>
    </div>
  );
}
