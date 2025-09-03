"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { backgroundAutomation } from '@/lib/background-automation';
import { 
  Bot, 
  Play, 
  Pause, 
  Clock, 
  Zap,
  TrendingUp,
  Settings,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface AutomationTask {
  id: string;
  assistantId: string;
  assistantName: string;
  taskType: string;
  description: string;
  interval: number;
  timeSaved: number;
  impact: 'low' | 'medium' | 'high';
  lastExecuted: Date;
  isActive: boolean;
}

export function AutomationStatus() {
  const [automations, setAutomations] = useState<AutomationTask[]>([]);
  const [nextExecutions, setNextExecutions] = useState<Array<{taskId: string, description: string, nextExecution: Date}>>([]);

  useEffect(() => {
    // Initial load
    setAutomations(backgroundAutomation.getAutomationStatus());
    setNextExecutions(backgroundAutomation.getNextExecutions());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setAutomations(backgroundAutomation.getAutomationStatus());
      setNextExecutions(backgroundAutomation.getNextExecutions());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeInterval = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    } else {
      return `${minutes}min`;
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) {
      const pastMs = Math.abs(diffMs);
      const pastMins = Math.floor(pastMs / 60000);
      if (pastMins < 60) return `hace ${pastMins}min`;
      return `hace ${Math.floor(pastMins / 60)}h`;
    }
    
    const futureMins = Math.floor(diffMs / 60000);
    if (futureMins < 60) return `en ${futureMins}min`;
    return `en ${Math.floor(futureMins / 60)}h`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAssistantColor = (assistantId: string) => {
    switch (assistantId) {
      case 'sofia': return 'bg-pink-100 text-pink-700';
      case 'carlos': return 'bg-blue-100 text-blue-700';
      case 'paula': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleToggleAutomation = (taskId: string, isActive: boolean) => {
    if (isActive) {
      backgroundAutomation.pauseAutomation(taskId);
    } else {
      backgroundAutomation.resumeAutomation(taskId);
    }
    
    // Update state immediately
    setAutomations(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, isActive: !isActive } : task
      )
    );
  };

  const handleTriggerNow = (taskId: string) => {
    backgroundAutomation.triggerAutomation(taskId);
    
    // Update last executed time
    setAutomations(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, lastExecuted: new Date() } : task
      )
    );
  };

  const activeAutomations = automations.filter(a => a.isActive);
  const totalTimeSaved = automations.reduce((sum, a) => sum + a.timeSaved, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Overview Card */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold">
            <Bot className="w-5 h-5 mr-2 text-blue-500" />
            Automatizaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {activeAutomations.length}
              </div>
              <div className="text-green-700">Activas</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalTimeSaved.toFixed(1)}h
              </div>
              <div className="text-blue-700">Por ciclo</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado general</span>
              <Badge className="bg-green-100 text-green-700">
                {activeAutomations.length > 0 ? 'Funcionando' : 'Pausado'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Próxima ejecución</span>
              <span className="font-medium">
                {nextExecutions.length > 0 
                  ? formatRelativeTime(nextExecutions[0].nextExecution)
                  : 'N/A'
                }
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => backgroundAutomation.pauseAllAutomations()}
              >
                <Pause className="w-4 h-4 mr-1" />
                Pausar Todo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => backgroundAutomation.resumeAllAutomations()}
              >
                <Play className="w-4 h-4 mr-1" />
                Reanudar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Automations List */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Settings className="w-5 h-5 mr-2 text-purple-500" />
              Tareas Automatizadas
            </CardTitle>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 custom-scrollbar">
            <div className="space-y-3">
              {automations.map((automation) => (
                <div 
                  key={automation.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getAssistantColor(automation.assistantId)}>
                        {automation.assistantName}
                      </Badge>
                      <Badge className={getImpactColor(automation.impact)}>
                        {automation.impact === 'high' ? 'Alto Impacto' : 
                         automation.impact === 'medium' ? 'Medio Impacto' : 'Bajo Impacto'}
                      </Badge>
                      {automation.isActive ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Activa
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Pause className="w-3 h-3 mr-1" />
                          Pausada
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">
                      {automation.description}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Cada {formatTimeInterval(automation.interval)}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{automation.timeSaved}h ahorradas
                      </div>
                      <div>
                        Última: {formatRelativeTime(automation.lastExecuted)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTriggerNow(automation.id)}
                      disabled={!automation.isActive}
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant={automation.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleAutomation(automation.id, automation.isActive)}
                    >
                      {automation.isActive ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
