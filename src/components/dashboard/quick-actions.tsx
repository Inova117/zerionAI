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
      title: "Chat",
      description: "Inicia un chat con cualquier asistente",
      icon: MessageSquare,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Nueva conversación")
    },
    {
      title: "Automatizar",
      description: "Configura una nueva tarea automática",
      icon: Zap,
      color: "bg-yellow-500 hover:bg-yellow-600",
      onClick: () => console.log("Nueva automatización")
    },
    {
      title: "Cerebro AI",
      description: "Agrega conocimiento sobre tu negocio",
      icon: Brain,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Alimentar cerebro")
    },
    {
      title: "Analíticas",
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
      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <div key={index} className="flex flex-col items-center">
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 p-3 flex flex-col items-center justify-center hover:shadow-md transition-all duration-200 border hover:border-gray-300 group"
                onClick={action.onClick}
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
              </Button>
              <div className="text-center mt-2 px-1">
                <div className="font-medium text-gray-900 text-sm leading-tight">
                  {action.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
