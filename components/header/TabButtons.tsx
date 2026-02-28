'use client';

import { useExamStore } from '@/lib/exam-store';
import type { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function TabButtons() {
  const { currentTab, switchTab } = useExamStore();

  const tabs: { id: TabType; label: string }[] = [
    { id: 'timer', label: '⏰ Timer' },
    { id: 'stats', label: '📊 Estatísticas' },
  ];

  return (
    <div className="flex justify-center gap-3 mb-5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => switchTab(tab.id)}
          className={cn('tab-btn', currentTab === tab.id && 'active')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
