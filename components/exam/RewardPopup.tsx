'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/lib/exam-store';

export default function RewardPopup() {
  const pendingReward = useExamStore((s) => s.pendingReward);
  const clearReward = useExamStore((s) => s.clearReward);

  useEffect(() => {
    if (!pendingReward) return;
    const timer = setTimeout(clearReward, 3000);
    return () => clearTimeout(timer);
  }, [pendingReward, clearReward]);

  if (!pendingReward) return null;

  const totalBonus = pendingReward.milestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2 reward-bubble-enter">
      <div className="reward-bubble">
        <span className="reward-coin">$</span>
        <span className="reward-amount">+{pendingReward.amount}</span>
      </div>

      {pendingReward.milestones.map((m) => (
        <div key={m.at} className="reward-bubble reward-bubble-bonus" style={{ animationDelay: '0.2s' }}>
          <span className="reward-coin">$</span>
          <span className="reward-amount">BONUS +{m.amount}!</span>
          <span className="text-xs opacity-70 ml-1">{m.at} acertos</span>
        </div>
      ))}

      {totalBonus > 0 && (
        <div className="text-sm font-bold text-amber-700 opacity-0" style={{ animation: 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards' }}>
          Total: +{pendingReward.amount + totalBonus}!
        </div>
      )}
    </div>
  );
}
