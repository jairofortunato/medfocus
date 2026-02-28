'use client';

import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
}

export default function TimerDisplay({ seconds, isRunning }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        'text-[5rem] font-bold gradient-text tracking-wider mb-4 font-variant-numeric-tabular',
        isRunning && 'animate-pulse-timer'
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {formatTime(seconds)}
    </div>
  );
}
