'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface SSEEvent {
  type: 'progress' | 'explanation' | 'complete' | 'error';
  message: string;
  current?: number;
  total?: number;
  examSlug?: string;
  examName?: string;
  totalQuestions?: number;
}

export default function ImportPage() {
  const [examName, setExamName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<{ examSlug: string; totalQuestions: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (type: string, message: string) => {
    setLogs((prev) => [...prev, { type, message }]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !examName.trim()) return;

    setIsImporting(true);
    setLogs([]);
    setProgress(null);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('examName', examName.trim());

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Erro na importação');
        setIsImporting(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setError('Stream não disponível');
        setIsImporting(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event: SSEEvent = JSON.parse(line.slice(6));

            if (event.type === 'progress') {
              addLog('info', event.message);
            } else if (event.type === 'explanation') {
              addLog('ai', event.message);
              if (event.current && event.total) {
                setProgress({ current: event.current, total: event.total });
              }
            } else if (event.type === 'complete') {
              addLog('success', event.message);
              setResult({
                examSlug: event.examSlug!,
                totalQuestions: event.totalQuestions!,
              });
            } else if (event.type === 'error') {
              addLog('error', event.message);
              setError(event.message);
            }
          } catch {
            // Ignore malformed SSE
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      setError(message);
      addLog('error', message);
    } finally {
      setIsImporting(false);
    }
  };

  const progressPercent = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 relative z-10">
      {/* Header */}
      <div className="glass-header p-7 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold gradient-text tracking-tight">
            Importar Prova (PDF)
          </h1>
          <Link href="/dashboard" className="glass-btn text-sm">
            Voltar
          </Link>
        </div>
        <p className="text-slate-500 text-base">
          Envie um PDF de prova para extrair questões, gabarito e gerar explicações com IA
        </p>
      </div>

      {/* Upload form */}
      <div className="glass-card p-8 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam name */}
          <div>
            <label htmlFor="examName" className="block text-sm font-semibold text-slate-700 mb-2">
              Nome da Prova
            </label>
            <input
              id="examName"
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Ex: ENARE 2024"
              disabled={isImporting}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all disabled:opacity-50"
            />
          </div>

          {/* File input */}
          <div>
            <label htmlFor="pdf" className="block text-sm font-semibold text-slate-700 mb-2">
              Arquivo PDF
            </label>
            <input
              id="pdf"
              type="file"
              accept=".pdf"
              disabled={isImporting}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 transition-all disabled:opacity-50"
            />
            <p className="text-xs text-slate-400 mt-1">PDF de até 10MB no formato ENARE</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isImporting || !file || !examName.trim()}
            className="gradient-btn w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importando...' : 'Iniciar Importação'}
          </button>
        </form>
      </div>

      {/* Progress section */}
      {(logs.length > 0 || isImporting) && (
        <div className="glass-card p-6 mb-6">
          {/* Progress bar for explanation generation */}
          {progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Gerando explicações</span>
                <span>{progress.current}/{progress.total} ({progressPercent}%)</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-progress rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Log messages */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1.5">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`text-sm font-mono px-3 py-1.5 rounded-lg ${
                  log.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : log.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : log.type === 'ai'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                {log.type === 'error' && '✗ '}
                {log.type === 'success' && '✓ '}
                {log.type === 'ai' && '🤖 '}
                {log.type === 'info' && '→ '}
                {log.message}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && !isImporting && (
        <div className="glass-card p-5 mb-6 border-red-200 bg-red-50/60">
          <p className="text-red-700 font-semibold">Erro na importação</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="glass-card p-6 text-center">
          <p className="text-xl font-bold text-green-700 mb-2">Importação concluída!</p>
          <p className="text-slate-600 mb-4">
            {result.totalQuestions} questões importadas com sucesso.
          </p>
          <Link
            href={`/exam/${result.examSlug}`}
            className="gradient-btn inline-block"
          >
            Abrir Prova
          </Link>
        </div>
      )}
    </div>
  );
}
