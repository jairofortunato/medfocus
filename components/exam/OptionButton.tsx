'use client';

import { cn } from '@/lib/utils';

interface OptionButtonProps {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isAnswered: boolean;
  onClick: () => void;
}

export default function OptionButton({
  letter,
  text,
  isSelected,
  isCorrect,
  isAnswered,
  onClick,
}: OptionButtonProps) {
  const getOptionClass = () => {
    if (!isAnswered) {
      return isSelected ? 'selected' : '';
    }
    if (isCorrect) {
      return 'correct';
    }
    if (isSelected && !isCorrect) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={cn('option-card', getOptionClass())}
    >
      <div className="option-letter">{letter}</div>
      <div className="flex-1 text-left text-[1.1rem] text-slate-600 pt-1.5">
        {text}
      </div>
    </button>
  );
}
