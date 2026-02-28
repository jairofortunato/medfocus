'use client';

import { useExamStore } from '@/lib/exam-store';
import type { Question } from '@/lib/types';
import OptionButton from './OptionButton';
import ExplanationBox from './ExplanationBox';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
}

export default function QuestionCard({ question, questionIndex }: QuestionCardProps) {
  const { userAnswers, selectAnswer } = useExamStore();
  const userAnswer = userAnswers[question.id];
  const isAnswered = !!userAnswer;
  const isCorrect = userAnswer === question.resposta_correta;

  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D' | 'E') => {
    selectAnswer(question.id, option);
  };

  return (
    <div className="glass-card p-9 mb-5">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="question-badge">Questao {question.numero}</div>
        <div className="flex gap-2 flex-wrap">
          {question.tags.map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-xl leading-relaxed mb-8 text-slate-700">
        {question.enunciado}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3.5">
        {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => (
          <OptionButton
            key={letter}
            letter={letter}
            text={question.alternativas[letter]}
            isSelected={userAnswer === letter}
            isCorrect={question.resposta_correta === letter}
            isAnswered={isAnswered}
            onClick={() => handleOptionClick(letter)}
          />
        ))}
      </div>

      {/* Explanation - show after answer */}
      {isAnswered && (
        <ExplanationBox
          isCorrect={isCorrect}
          explanation={question.explicacao}
          correctAnswer={question.resposta_correta}
        />
      )}
    </div>
  );
}
