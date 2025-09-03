"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  MessageSquare, 
  FileText, 
  Calendar,
  BarChart3,
  Settings,
  Zap,
  Brain
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Nueva Conversación",
      description: "Inicia un chat con cualquier asistente",
      icon: MessageSquare,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Nueva conversación")
    },
    {
      title: "Crear Automatización",
      description: "Configura una nueva tarea automática",
      icon: Zap,
      color: "bg-yellow-500 hover:bg-yellow-600",
      onClick: () => console.log("Nueva automatización")
    },
    {
      title: "Alimentar Cerebro AI",
      description: "Agrega conocimiento sobre tu negocio",
      icon: Brain,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Alimentar cerebro")
    },
    {
      title: "Ver Analíticas",
      description: "Revisa el rendimiento de tus asistentes",
      icon: BarChart3,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => console.log("Ver analíticas")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-3 hover:shadow-md transition-all duration-200 border-2 hover:border-gray-300"
              onClick={action.onClick}
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-sm">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
