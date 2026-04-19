import { createClient } from '@/lib/supabase/server';
import { fetchTopicoCounts } from '@/lib/supabase/queries';
import { TAXONOMY } from '@/lib/config/taxonomy';
import AreaAccordionList from '@/components/study/AreaAccordionList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Questões por Área - Med Estudo Focado',
};

export default async function AreaSelectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch question counts per area + subtopico from topicos JSONB
  let topicoCounts: Awaited<ReturnType<typeof fetchTopicoCounts>> = {};
  try {
    topicoCounts = await fetchTopicoCounts(supabase);
  } catch {
    topicoCounts = {};
  }

  // Build the list enriched with counts
  const areas = TAXONOMY.map((area) => {
    const areaData = topicoCounts[area.name] ?? { total: 0, subtopicos: {} };
    return {
      ...area,
      totalCount: areaData.total,
      subtopicoCounts: areaData.subtopicos,
    };
  });

  const totalQuestions = areas.reduce((sum, a) => sum + a.totalCount, 0);
  const areasWithQuestions = areas.filter((a) => a.totalCount > 0).length;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 relative z-10">
      <div className="glass-header p-7 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-4 transition-colors hover:opacity-80"
          style={{ color: '#0F3683', fontFamily: 'Nunito, sans-serif' }}
        >
          ← Voltar
        </Link>
        <h1
          className="text-2xl font-black"
          style={{ color: '#0F3683', fontFamily: 'Nunito, sans-serif' }}
        >
          Questões por Área
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {areasWithQuestions} de 21 áreas disponíveis · {totalQuestions} questões no total
        </p>
        <p className="text-slate-400 text-xs mt-0.5">
          Clique em uma área para ver os subtópicos
        </p>
      </div>

      <AreaAccordionList areas={areas} />
    </div>
  );
}
