"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  MessageSquare, 
  Zap, 
  Clock, 
  TrendingUp,
  Settings,
  BarChart3,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import { Assistant } from "@/lib/assistants";

interface AssistantInfoProps {
  assistant: Assistant;
}

export function AssistantInfo({ assistant }: AssistantInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulated stats for the assistant
  const stats = {
    conversations: 23,
    tasksCompleted: 156,
    efficiency: 94,
    responseTime: "1.2s",
    satisfaction: 4.8
  };

  const recentTasks = [
    "Creó calendario de contenido para Instagram",
    "Optimizó 5 posts para mejor engagement",
    "Configuró hashtags automáticos",
    "Generó ideas para 10 reels virales",
    "Programó posts para toda la semana"
  ];

  const capabilities = [
    "Creación de contenido viral",
    "Programación automática", 
    "Análisis de engagement",
    "Gestión de comunidad",
    "Estrategias de crecimiento",
    "Optimización de hashtags",
    "Calendario editorial",
    "Tendencias y insights"
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <ScrollArea className="h-full custom-scrollbar">
        <div className="p-6">
          {/* Compact Header - Always Visible */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-2xl ${assistant.color} flex items-center justify-center text-2xl mb-3`}>
              {assistant.avatar}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{assistant.name}</h2>
            <p className="text-sm text-gray-600 font-medium">{assistant.role}</p>
            <div className="flex items-center justify-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-green-600 font-medium">En línea</span>
            </div>
          </div>

          {/* Toggle Button */}
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Menu className="w-4 h-4 mr-2" />
            {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
            {isExpanded ? <X className="w-4 h-4 ml-2" /> : null}
          </Button>

          {/* Expandable Content */}
          {isExpanded && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Info</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Descripción</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {assistant.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Especialidades</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {assistant.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Capabilities */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Capacidades</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {capabilities.slice(0, 4).map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{stats.conversations}</div>
                        <p className="text-xs text-gray-500">Conversaciones</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{stats.tasksCompleted}</div>
                        <p className="text-xs text-gray-500">Tareas</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Eficiencia</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${stats.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.efficiency}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tiempo de respuesta</span>
                        <span className="text-sm font-medium">{stats.responseTime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfacción</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{stats.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {recentTasks.slice(0, 4).map((task, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Zap className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-xs text-gray-600 leading-relaxed">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button type="button" variant="outline" className="w-full justify-start text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                  <Button type="button" variant="outline" className="w-full justify-start text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button type="button" variant="outline" className="w-full justify-start text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Historial
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
