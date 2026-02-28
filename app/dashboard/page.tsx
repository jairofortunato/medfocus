import { createClient } from '@/lib/supabase/server';
import { fetchExams } from '@/lib/supabase/queries';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard - Med Estudo Focado',
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let exams: any[] = [];
  try {
    exams = await fetchExams(supabase);
  } catch {
    // Will show empty state
  }

  // Fetch user progress for each exam
  const { data: progressData } = await supabase
    .from('user_exam_progress')
    .select('exam_id, current_question_numero')
    .eq('user_id', user?.id ?? '') as { data: { exam_id: string; current_question_numero: number }[] | null };

  const progressMap: Record<string, number> = {};
  progressData?.forEach((p) => {
    progressMap[p.exam_id] = p.current_question_numero;
  });

  // Fetch answer counts per exam - count answers grouped by question's exam_id
  const { data: answerData } = await supabase
    .from('user_answers')
    .select('question_id')
    .eq('user_id', user?.id ?? '') as { data: { question_id: string }[] | null };

  // To get per-exam counts, fetch all questions to map question_id -> exam_id
  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, exam_id') as { data: { id: string; exam_id: string }[] | null };

  const questionExamMap: Record<string, string> = {};
  questionsData?.forEach((q) => {
    questionExamMap[q.id] = q.exam_id;
  });

  const answeredPerExam: Record<string, number> = {};
  answerData?.forEach((a) => {
    const examId = questionExamMap[a.question_id];
    if (examId) {
      answeredPerExam[examId] = (answeredPerExam[examId] || 0) + 1;
    }
  });

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 relative z-10">
      <div className="glass-header p-7 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-4xl font-bold gradient-text tracking-tight">
            Med Estudo Focado
          </h1>
          <LogoutButton />
        </div>
        <p className="text-slate-500 text-lg">
          Escolha uma prova para estudar
        </p>
      </div>

      {/* Import link */}
      <div className="mb-6">
        <Link
          href="/admin/import"
          className="glass-card p-5 hover:bg-white/85 transition-all duration-300 hover:-translate-y-0.5 block text-center"
        >
          <span className="text-lg font-semibold gradient-text">+ Importar Nova Prova (PDF)</span>
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-500 text-lg">
            Nenhuma prova disponivel no momento.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Execute o script de seed para importar questoes.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => {
            const answered = answeredPerExam[exam.id] || 0;
            const progress = exam.total_questoes > 0
              ? Math.round((answered / exam.total_questoes) * 100)
              : 0;

            return (
              <Link
                key={exam.id}
                href={`/exam/${exam.slug}`}
                className="glass-card p-6 hover:bg-white/85 transition-all duration-300 hover:-translate-y-0.5 block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {exam.nome}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {exam.total_questoes} questoes &middot; {exam.ano}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold gradient-text">
                      {progress}%
                    </div>
                    <p className="text-slate-400 text-xs">
                      {answered}/{exam.total_questoes} respondidas
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-progress rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
