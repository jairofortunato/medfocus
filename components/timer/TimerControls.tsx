'use client';

import { useExamStore } from '@/lib/exam-store';

export default function TimerControls() {
  const { timer, startTimer, pauseTimer, resetTimer } = useExamStore();

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <button
        onClick={timer.isRunning ? pauseTimer : startTimer}
        className="gradient-btn"
      >
        {timer.isRunning ? '⏸ Pausar' : '▶ Iniciar'}
      </button>
      <button onClick={resetTimer} className="glass-btn">
        🔄 Resetar
      </button>
    </div>
  );
}
