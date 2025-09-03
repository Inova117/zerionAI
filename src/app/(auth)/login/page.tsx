import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold">Sintra AI</h1>
          </Link>
          
          <h2 className="text-2xl font-bold mb-4">
            Bienvenido de vuelta
          </h2>
          
          <p className="text-blue-100 mb-6">
            Accede a tus asistentes IA y continúa automatizando tu negocio.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-sm">Acceso a todos tus asistentes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-sm">Historial de conversaciones</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-sm">Analytics y métricas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Success message for registration */}
          <Suspense fallback={null}>
            <RegistrationSuccessMessage />
          </Suspense>
          
          <LoginForm />
          
          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{' '}
              <Link href="/dashboard/help" className="text-blue-600 hover:text-blue-500">
                Contacta soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistrationSuccessMessage() {
  // This would check URL params for success message
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const message = searchParams.get('message');
  
  if (message === 'registration-success') {
    return (
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          ¡Registro exitoso! Por favor, revisa tu email para confirmar tu cuenta.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
