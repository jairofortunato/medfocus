import AuthForm from '@/components/auth/AuthForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cadastro - Med Estudo Focado',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold gradient-text mb-2 text-center">
          Med Estudo Focado
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Crie sua conta e comece a estudar
        </p>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
