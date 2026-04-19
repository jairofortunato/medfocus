'use client';

import { useState, useTransition } from 'react';
import { createStudyPlan } from '@/app/study/spaced/setup/actions';
import { RESIDENCY_COLORS } from '@/lib/spaced-repetition';
import { TAXONOMY } from '@/lib/config/taxonomy';

const DARK_BLUE = '#0F3683';

const DAYS = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
];

// Total subtopics across all taxonomy areas
const TOTAL_SUBTOPICOS = TAXONOMY.reduce((s, a) => s + a.subtopicos.length, 0);

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [subjectsPerDay, setSubjectsPerDay] = useState(2);
  const [questionsPerDay, setQuestionsPerDay] = useState(30);
  const [isPending, startTransition] = useTransition();

  function toggleDay(d: number) {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort(),
    );
  }

  // Preview: estimate days to cover all subtopics once
  const studyDaysPerWeek = selectedDays.length;
  const daysToComplete =
    studyDaysPerWeek > 0
      ? Math.ceil(TOTAL_SUBTOPICOS / (studyDaysPerWeek * subjectsPerDay))
      : 999;

  function handleSubmit() {
    const fd = new FormData();
    fd.append('days_of_week', JSON.stringify(selectedDays));
    fd.append('subjects_per_day', String(subjectsPerDay));
    fd.append('questions_per_day', String(questionsPerDay));
    startTransition(() => createStudyPlan(fd));
  }

  return (
    <div className="glass-card p-8 max-w-lg mx-auto">

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
              style={{
                backgroundColor: step >= s ? DARK_BLUE : '#E2E8F0',
                color: step >= s ? '#fff' : '#94A3B8',
              }}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className="w-12 h-0.5 rounded"
                style={{ backgroundColor: step > s ? DARK_BLUE : '#E2E8F0' }}
              />
            )}
          </div>
        ))}
        <span className="ml-3 text-sm text-slate-400">
          {step === 1 && 'Dias de estudo'}
          {step === 2 && 'Intensidade'}
          {step === 3 && 'Confirmar plano'}
        </span>
      </div>

      {/* ── Step 1: Days ── */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
            Quais dias você estuda?
          </h2>
          <p className="text-sm text-slate-400 mb-6">Selecione os dias da semana em que você costuma estudar.</p>

          <div className="flex gap-2 justify-center mb-8">
            {DAYS.map((d) => {
              const active = selectedDays.includes(d.value);
              return (
                <button
                  key={d.value}
                  onClick={() => toggleDay(d.value)}
                  className="w-11 h-11 rounded-xl text-sm font-bold transition-all"
                  style={{
                    backgroundColor: active ? DARK_BLUE : '#F1F5F9',
                    color: active ? '#fff' : '#64748B',
                    border: active ? `2px solid ${DARK_BLUE}` : '2px solid transparent',
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {selectedDays.length === 0 && (
            <p className="text-rose-500 text-sm text-center mb-4">Selecione pelo menos 1 dia.</p>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={selectedDays.length === 0}
            className="w-full py-3 rounded-xl font-bold text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: DARK_BLUE }}
          >
            Próximo →
          </button>
        </div>
      )}

      {/* ── Step 2: Intensity ── */}
      {step === 2 && (
        <div>
          {/* Subtópicos por dia */}
          <h2 className="text-xl font-black mb-1" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
            Quantos subtópicos por dia?
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Cada subtópico é um conjunto de questões sobre um tema, ex: "Hipertensão Arterial".
          </p>

          <div className="grid grid-cols-3 gap-3 mb-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setSubjectsPerDay(n)}
                className="py-4 rounded-xl font-black text-xl transition-all"
                style={{
                  backgroundColor: subjectsPerDay === n ? DARK_BLUE : '#F1F5F9',
                  color: subjectsPerDay === n ? '#fff' : '#64748B',
                  border: subjectsPerDay === n ? `2px solid ${DARK_BLUE}` : '2px solid transparent',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mb-7">
            {subjectsPerDay} subtópico{subjectsPerDay > 1 ? 's' : ''} por dia ·{' '}
            {selectedDays.length * subjectsPerDay} por semana
          </p>

          {/* Divisor */}
          <div className="border-t border-slate-100 mb-7" />

          {/* Questões por dia */}
          <h2 className="text-xl font-black mb-1" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
            Quantas questões por dia?
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Meta diária de questões respondidas no total.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-2">
            {[10, 20, 30, 40, 50, 60].map((n) => (
              <button
                key={n}
                onClick={() => setQuestionsPerDay(n)}
                className="py-4 rounded-xl font-black text-xl transition-all"
                style={{
                  backgroundColor: questionsPerDay === n ? DARK_BLUE : '#F1F5F9',
                  color: questionsPerDay === n ? '#fff' : '#64748B',
                  border: questionsPerDay === n ? `2px solid ${DARK_BLUE}` : '2px solid transparent',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mb-8">
            {questionsPerDay} questões por dia · {questionsPerDay * selectedDays.length} por semana
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100"
            >
              ← Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: DARK_BLUE }}
            >
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Preview & confirm ── */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
            Seu plano de estudos
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Revise as configurações antes de criar o plano.
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl p-4" style={{ backgroundColor: `${DARK_BLUE}08` }}>
              <div className="text-xs text-slate-500 mb-1">Dias por semana</div>
              <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
                {selectedDays.length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {selectedDays.map((d) => DAYS.find((x) => x.value === d)?.label).join(' · ')}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: `${DARK_BLUE}08` }}>
              <div className="text-xs text-slate-500 mb-1">Subtópicos / dia</div>
              <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
                {subjectsPerDay}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {selectedDays.length * subjectsPerDay} por semana
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: `${DARK_BLUE}08` }}>
              <div className="text-xs text-slate-500 mb-1">Questões / dia</div>
              <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
                {questionsPerDay}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {questionsPerDay * selectedDays.length} por semana
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: `${DARK_BLUE}08` }}>
              <div className="text-xs text-slate-500 mb-1">Total de subtópicos</div>
              <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
                {TOTAL_SUBTOPICOS}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ~{daysToComplete} dias p/ 1ª rodada
              </div>
            </div>
          </div>

          {/* Residency area legend */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">
              Distribuição inicial (≈ 20% cada)
            </p>
            <div className="flex flex-wrap gap-2">
              {(['Clínica Médica', 'Cirurgia', 'Ginecologia e Obstetrícia', 'Pediatria', 'Medicina Preventiva'] as const).map((g, i) => (
                <span
                  key={g}
                  className="text-xs px-2 py-1 rounded-full font-medium text-white"
                  style={{ backgroundColor: i % 2 === 0 ? '#E292BE' : '#5BA1EB' }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 disabled:opacity-40"
            >
              ← Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: DARK_BLUE }}
            >
              {isPending ? 'Criando plano…' : 'Criar plano ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
