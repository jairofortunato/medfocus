'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName || email.split('@')[0],
            },
          },
        });
        if (error) throw error;
        setMessage('Verifique seu email para confirmar o cadastro.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect will be handled by middleware
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === 'signup' && (
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-slate-600 mb-1.5">
            Nome
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1.5">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Minimo 6 caracteres"
          className="w-full px-4 py-3 rounded-xl bg-white/60 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gradient-btn w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Carregando...'
          : mode === 'login'
            ? 'Entrar'
            : 'Criar Conta'}
      </button>

      <div className="text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            Ainda nao tem conta?{' '}
            <a href="/auth/signup" className="text-pink-500 hover:text-pink-600 font-medium">
              Cadastre-se
            </a>
          </>
        ) : (
          <>
            Ja tem uma conta?{' '}
            <a href="/auth/login" className="text-pink-500 hover:text-pink-600 font-medium">
              Entrar
            </a>
          </>
        )}
      </div>
    </form>
  );
}
