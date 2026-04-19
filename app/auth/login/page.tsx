import AuthForm from '@/components/auth/AuthForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - Med Estudo Focado',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <img src="/logo.png" alt="Med Focus" className="h-40 mx-auto mb-2" />
        <p className="subtitle-text text-center mb-8">
          Entre na sua conta para continuar
        </p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
