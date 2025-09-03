import { RegisterForm } from '@/components/auth/register-form';
import { CheckCircle, Zap, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold">Sintra AI</h1>
          </Link>
          
          <h2 className="text-2xl font-bold mb-4">
            Únete a la revolución de la IA
          </h2>
          
          <p className="text-purple-100 mb-6">
            Miles de empresas ya automatizan sus procesos con Sintra AI. 
            ¡Comienza gratis hoy!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-purple-500 rounded">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">14 días gratis</h3>
                <p className="text-xs text-purple-100">
                  Prueba todos los asistentes sin costo
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 bg-purple-500 rounded">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">12 asistentes especializados</h3>
                <p className="text-xs text-purple-100">
                  Para marketing, ventas, soporte y más
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 bg-purple-500 rounded">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Datos seguros</h3>
                <p className="text-xs text-purple-100">
                  Encriptación y cumplimiento GDPR
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-purple-400">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-xs text-purple-200">Empresas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-xs text-purple-200">Tareas automatizadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <RegisterForm />
          
          {/* Trust badges */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Setup en 2 min</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                términos de servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                política de privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
