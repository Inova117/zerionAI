"use client";

import { AutomationStatus } from "@/components/dashboard/automation-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Zap, 
  Clock, 
  TrendingUp,
  Settings,
  AlertCircle
} from "lucide-react";

export default function AutomationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
          <Bot className="w-8 h-8 mr-3 text-blue-500" />
          Automatizaciones 24/7
        </h1>
        <p className="text-gray-600 mt-2">
          Tus asistentes trabajan automáticamente en segundo plano, incluso cuando no estás aquí.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-blue-900">
              <Zap className="w-5 h-5 mr-2" />
              Siempre Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 mb-3">
              Tus asistentes nunca duermen. Trabajan continuamente optimizando tus procesos.
            </p>
            <Badge className="bg-blue-100 text-blue-700">
              🤖 24/7 en funcionamiento
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-green-900">
              <TrendingUp className="w-5 h-5 mr-2" />
              Mejora Continua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 mb-3">
              Cada automatización aprende y se optimiza basándose en resultados anteriores.
            </p>
            <Badge className="bg-green-100 text-green-700">
              📈 Auto-optimización
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-purple-900">
              <Clock className="w-5 h-5 mr-2" />
              Tiempo Maximizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-800 mb-3">
              Liberamos tu tiempo para actividades estratégicas mientras nosotros manejamos lo rutinario.
            </p>
            <Badge className="bg-purple-100 text-purple-700">
              ⏰ Eficiencia máxima
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Automation Status */}
      <AutomationStatus />

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold">
            <Settings className="w-5 h-5 mr-2 text-gray-500" />
            ¿Cómo Funcionan las Automatizaciones?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <h4 className="font-semibold text-gray-900">Sofía - Social Media</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monitoreo de tendencias cada 30 min</li>
                <li>• Optimización de contenido cada 2h</li>
                <li>• Reportes de engagement cada 6h</li>
                <li>• Análisis de competencia automático</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h4 className="font-semibold text-gray-900">Carlos - Soporte</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Optimización de WhatsApp cada 1h</li>
                <li>• Análisis de tickets cada 3h</li>
                <li>• Actualización de FAQ cada 4h</li>
                <li>• Métricas de satisfacción automáticas</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✍️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Paula - Copywriting</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Análisis de copy cada 2h</li>
                <li>• Tests A/B automáticos cada 8h</li>
                <li>• Optimización de conversión cada 5h</li>
                <li>• Refinamiento de mensajes continuo</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">Nota Importante</h5>
                <p className="text-sm text-yellow-800">
                  Las automatizaciones se ejecutan en segundo plano incluso cuando cierras la aplicación. 
                  Puedes pausar o ajustar cualquier automatización en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
