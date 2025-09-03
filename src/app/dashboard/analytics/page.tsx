"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { brainAI } from '@/lib/brain-ai';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Users, 
  MessageSquare, 
  CheckCircle,
  Calendar,
  Award,
  Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const { metrics, activities, isLoading } = useDashboardMetrics();
  const [timeRange, setTimeRange] = useState('7d');
  const [brainData, setBrainData] = useState<any>(null);

  useEffect(() => {
    setBrainData(brainAI.getBrainAIData());
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  const improvementMetrics = [
    {
      title: "Productividad General",
      current: 87,
      previous: 74,
      trend: "up",
      unit: "%"
    },
    {
      title: "Tiempo de Respuesta",
      current: 2.4,
      previous: 3.8,
      trend: "down",
      unit: "min"
    },
    {
      title: "Tareas Completadas",
      current: metrics.tasksCompleted,
      previous: metrics.tasksCompleted - 12,
      trend: "up",
      unit: ""
    },
    {
      title: "Satisfacción Promedio",
      current: 4.6,
      previous: 4.2,
      trend: "up",
      unit: "/5"
    }
  ];

  const assistantPerformance = brainData ? Object.values(brainData.relationships).map((rel: any) => ({
    name: rel.assistantId,
    interactions: rel.interactionCount,
    successRate: Math.round((rel.successfulTasks / rel.interactionCount) * 100),
    satisfaction: rel.userSatisfaction,
    trustLevel: Math.round(rel.trustLevel * 100)
  })) : [];

  const weeklyData = [
    { day: 'Lun', tasks: 8, time: 2.5 },
    { day: 'Mar', tasks: 12, time: 3.2 },
    { day: 'Mié', tasks: 6, time: 1.8 },
    { day: 'Jue', tasks: 15, time: 4.1 },
    { day: 'Vie', tasks: 11, time: 2.9 },
    { day: 'Sáb', tasks: 4, time: 1.2 },
    { day: 'Dom', tasks: 7, time: 2.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analíticas</h1>
            <p className="text-gray-600">Insights y métricas de rendimiento de tus asistentes IA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {improvementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.trend === 'up' ? '+' : ''}
                  {((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.current}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs {metric.previous}{metric.unit} período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assistants">Asistentes</TabsTrigger>
          <TabsTrigger value="productivity">Productividad</TabsTrigger>
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rendimiento Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-200 h-2 rounded-full flex-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(day.tasks / 15) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-8">{day.tasks}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-12">{day.time}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Milestone: 50 Tareas Completadas</p>
                      <p className="text-xs text-gray-600">Hace 2 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Productividad +23% esta semana</p>
                      <p className="text-xs text-gray-600">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Automatización configurada</p>
                      <p className="text-xs text-gray-600">Hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ASSISTANTS TAB */}
        <TabsContent value="assistants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assistantPerformance.map((assistant, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="capitalize">{assistant.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Tasa de Éxito</span>
                      <span className="text-sm font-medium">{assistant.successRate}%</span>
                    </div>
                    <Progress value={assistant.successRate} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Nivel de Confianza</span>
                      <span className="text-sm font-medium">{assistant.trustLevel}%</span>
                    </div>
                    <Progress value={assistant.trustLevel} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Interacciones</p>
                      <p className="text-xl font-bold">{assistant.interactions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Satisfacción</p>
                      <p className="text-xl font-bold">{assistant.satisfaction.toFixed(1)}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PRODUCTIVITY TAB */}
        <TabsContent value="productivity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Distribución de Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Tareas Completadas</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="bg-green-200">
                      <div className="bg-green-600 h-full rounded-full" style={{ width: '65%' }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Conversaciones</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} className="bg-blue-200">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '25%' }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Configuración</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} className="bg-purple-200">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '10%' }} />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Métricas de Eficiencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{metrics.timeSaved}</p>
                    <p className="text-sm text-gray-600">Horas Ahorradas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{metrics.productivity}%</p>
                    <p className="text-sm text-gray-600">Productividad</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">2.4</p>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">94%</p>
                    <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GOALS TAB */}
        <TabsContent value="goals" className="space-y-4">
          {brainData && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso de Objetivos Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(brainData.analytics.monthlyGoalProgress).map(([goal, progress]: [string, any]) => (
                    <div key={goal}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{goal}</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Objetivos Principales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {brainData.userProfile.goals.primary.map((goal: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Hitos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {brainData.globalContext.upcomingDeadlines.map((deadline: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{deadline.task}</span>
                          <Badge variant={deadline.priority === 'high' ? 'default' : 'secondary'}>
                            {deadline.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
