import AuthForm from '@/components/auth/AuthForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - Med Estudo Focado',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold gradient-text mb-2 text-center">
          Med Estudo Focado
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Entre na sua conta para continuar
        </p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
