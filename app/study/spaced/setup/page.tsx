import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SetupWizard from '@/components/spaced/SetupWizard';
import { fetchStudyPlanConfig } from '@/lib/supabase/sr-queries';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Criar Plano de Estudos - Med Estudo Focado',
};

const DARK_BLUE = '#0F3683';

export default async function SpacedSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // If plan already exists, let user reconfigure (don't auto-redirect)
  let existingConfig = null;
  try {
    existingConfig = await fetchStudyPlanConfig(supabase, user.id);
  } catch {
    // Non-blocking — page still renders if config fetch fails
  }

  return (
    <div className="max-w-[600px] mx-auto px-6 py-12 relative z-10">
      <div className="glass-header px-5 py-5 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-4 transition-colors hover:opacity-80"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          ← Voltar
        </Link>
        <h1
          className="text-2xl font-black mb-0.5"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          {existingConfig ? 'Reconfigurar plano' : 'Criar plano de estudos'}
        </h1>
        <p className="text-slate-400 text-sm">
          Repetição espaçada personalizada com base no seu desempenho
        </p>
      </div>

      {existingConfig && (
        <div
          className="mb-4 px-4 py-3 rounded-2xl text-sm backdrop-blur-glass"
          style={{
            background: 'linear-gradient(135deg, rgba(225, 245, 255, 0.75), rgba(255, 255, 255, 0.85))',
            border: '2px solid #0F3683',
            color: '#0F3683',
          }}
        >
          ⚠️ Você já tem um plano ativo. Criar um novo plano irá substituir o anterior.
        </div>
      )}

      <SetupWizard />
    </div>
  );
}
