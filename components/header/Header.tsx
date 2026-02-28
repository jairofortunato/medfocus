'use client';

import { useExamStore } from '@/lib/exam-store';
import ProgressBar from './ProgressBar';
import ProgressStats from './ProgressStats';
import TabButtons from './TabButtons';
import TimerDisplay from '../timer/TimerDisplay';
import TimerControls from '../timer/TimerControls';
import StatisticsTable from '../statistics/StatisticsTable';

interface HeaderProps {
  examNome?: string;
}

export default function Header({ examNome }: HeaderProps) {
  const { timer, currentTab } = useExamStore();

  return (
    <header className="glass-header p-7 mb-6">
      <h1 className="text-4xl font-bold gradient-text mb-1 tracking-tight">
        Med Estudo Focado
      </h1>
      <div className="text-slate-500 text-lg mb-5 font-normal">
        {examNome ?? 'ENARE 2023'} - Preparacao Completa
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Progress Stats */}
      <ProgressStats />

      {/* Tab Buttons */}
      <TabButtons />

      {/* Tab Content */}
      {currentTab === 'timer' ? (
        <div className="my-6 text-center">
          <TimerDisplay seconds={timer.timeRemaining} isRunning={timer.isRunning} />
          <TimerControls />
        </div>
      ) : (
        <StatisticsTable />
      )}
    </header>
  );
}
