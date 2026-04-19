'use client';

interface ExplanationBoxProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

export default function ExplanationBox({
  isCorrect,
  explanation,
  correctAnswer,
}: ExplanationBoxProps) {
  return (
    <div className="glass-card p-7 mt-5">
      <div className="flex items-center gap-3.5 border-b border-slate-200/80 mb-5 pb-5">
        <div className="text-2xl">
          {isCorrect ? '✅' : '❌'}
        </div>
        <div>
          <h3 className="title-text text-lg m-0">
            {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
          </h3>
        </div>
      </div>

      <div className="leading-relaxed text-slate-600 text-[0.95rem]">
        <p className="mb-3.5 whitespace-pre-line">{explanation}</p>
      </div>

      {!isCorrect && (
        <div className="correct-answer-box">
          <h4 className="subtitle-text font-semibold mb-2.5 mt-0">
            Resposta Correta: {correctAnswer}
          </h4>
        </div>
      )}
    </div>
  );
}
