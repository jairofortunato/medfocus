'use client';

import { useExamStore } from '@/lib/exam-store';
import type { Question } from '@/lib/types';
import OptionButton from './OptionButton';
import ExplanationBox from './ExplanationBox';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  examNome?: string;
}

export default function QuestionCard({ question, questionIndex, examNome }: QuestionCardProps) {
  const { userAnswers, selectAnswer } = useExamStore();
  const userAnswer = userAnswers[question.id];
  const isAnswered = !!userAnswer;
  const isCorrect = userAnswer === question.resposta_correta;

  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D' | 'E') => {
    selectAnswer(question.id, option);
  };

  return (
    <div className="glass-card p-9 mb-5">
      {/* Exam / area / subtopico title */}
      {examNome && (
        <h2
          className="text-xl font-black mb-5"
          style={{ color: '#0F3683', fontFamily: 'Nunito, sans-serif' }}
        >
          {examNome}
        </h2>
      )}

      {/* Question Header */}
      <div className="flex justify-between items-start mb-6 gap-4">
        <span
          className="px-4 py-1.5 rounded-full text-sm font-black"
          style={{ backgroundColor: '#E292BE', color: '#E1F5FF', fontFamily: 'Nunito, sans-serif' }}
        >
          Questão {question.numero}
        </span>
        <div className="flex gap-2 flex-wrap">
          {question.area && (
            <span
              className="px-4 py-1.5 rounded-full text-sm font-black"
              style={{ backgroundColor: '#E1F5FF', color: '#E292BE', fontFamily: 'Nunito, sans-serif' }}
            >
              {question.area}
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-xl leading-relaxed mb-8 text-slate-700">
        {question.examNome && (
          <span className="font-bold mr-2 text-slate-500">
            ({question.examNome})
          </span>
        )}
        {question.enunciado}
      </div>

      {/* Question Images (X-rays, tables, charts, etc.) */}
      {question.images && question.images.length > 0 && (
        <div className="mb-6 space-y-3 flex flex-col items-center">
          {question.images.map((img) => (
            <div key={img.id} className="rounded-lg overflow-hidden border border-slate-200 bg-white max-w-[65%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.alt_text || `Imagem da questão ${question.numero}`}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3.5">
        {(['A', 'B', 'C', 'D', 'E'] as const)
          .filter((letter) => question.alternativas[letter])
          .map((letter) => (
          <OptionButton
            key={letter}
            letter={letter}
            text={question.alternativas[letter]!}
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
