'use client';

import { useExamStore } from '@/lib/exam-store';

export default function QuestionNavigation() {
  const { questions, currentQuestionIndex, setCurrentQuestion, nextQuestion, prevQuestion } =
    useExamStore();

  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex justify-center items-center gap-3 mb-6">
      <button
        onClick={prevQuestion}
        disabled={isFirst}
        className="glass-btn"
      >
        ← Anterior
      </button>

      <select
        value={currentQuestionIndex}
        onChange={(e) => setCurrentQuestion(Number(e.target.value))}
        className="glass-btn flex-1 max-w-[180px] text-center appearance-none bg-[length:12px_12px] bg-no-repeat pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 16px center',
        }}
      >
        {questions.map((q, index) => (
          <option key={q.numero} value={index}>
            Questão {q.numero}
          </option>
        ))}
      </select>

      <button
        onClick={nextQuestion}
        disabled={isLast}
        className="glass-btn"
      >
        Próxima →
      </button>
    </div>
  );
}
