'use client';

import { useExamStore } from '@/lib/exam-store';

interface RewardBadgeProps {
  correctCountBefore: number;
}

const MILESTONES = [
  { at: 10, amount: 50 },
  { at: 20, amount: 75 },
  { at: 30, amount: 100 },
];

export default function RewardBadge({ correctCountBefore }: RewardBadgeProps) {
  const correctCountNow = correctCountBefore + 1;

  // Check which milestones were just hit
  const newMilestones = MILESTONES.filter(
    (m) => correctCountBefore < m.at && correctCountNow >= m.at
  );

  const totalBonus = newMilestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="reward-container">
      <div className="reward-badge reward-pop">
        <span className="reward-coin">$</span>
        <span className="reward-amount">+10 dinheiros</span>
      </div>

      {newMilestones.map((m) => (
        <div key={m.at} className="reward-badge reward-bonus reward-pop">
          <span className="reward-coin">$</span>
          <span className="reward-amount">
            BONUS +{m.amount} dinheiros!
          </span>
          <span className="reward-milestone">
            {m.at} acertos!
          </span>
        </div>
      ))}

      {totalBonus > 0 && (
        <div className="reward-total reward-pop">
          Total: +{10 + totalBonus} dinheiros!
        </div>
      )}
    </div>
  );
}
