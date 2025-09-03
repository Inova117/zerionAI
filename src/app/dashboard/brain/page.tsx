"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { brainAI, BrainAIData, UserProfile } from '@/lib/brain-ai';
import { Brain, User, Target, TrendingUp, Calendar, Settings, Lightbulb, Award, Clock } from 'lucide-react';

export default function BrainAIPage() {
  const [brainData, setBrainData] = useState<BrainAIData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const data = brainAI.getBrainAIData();
    setBrainData(data);
    setEditableProfile(data.userProfile);
  }, []);

  const handleSaveProfile = () => {
    if (editableProfile) {
      brainAI.updateUserProfile(editableProfile);
      setBrainData(brainAI.getBrainAIData());
      setIsEditing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!brainData || !editableProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Cargando Cerebro AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cerebro AI</h1>
            <p className="text-gray-600">Centro de conocimiento e inteligencia de usuario</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          Última actualización: {formatDate(brainData.lastUpdated)}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Asistentes
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* PERFIL TAB */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nombre</label>
                      <Input
                        value={editableProfile.personal.name}
                        onChange={(e) => setEditableProfile(prev => prev ? {
                          ...prev,
                          personal: { ...prev.personal, name: e.target.value }
                        } : null)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Idioma</label>
                      <Select
                        value={editableProfile.personal.language}
                        onValueChange={(value) => setEditableProfile(prev => prev ? {
                          ...prev,
                          personal: { ...prev.personal, language: value as 'es' | 'pt' | 'en' }
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">{brainData.userProfile.personal.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Idioma</p>
                      <p className="font-medium">
                        {brainData.userProfile.personal.language === 'es' ? 'Español' : 
                         brainData.userProfile.personal.language === 'pt' ? 'Português' : 'English'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Zona horaria</p>
                      <p className="font-medium">{brainData.userProfile.personal.timezone}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Información de Negocio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="font-medium">{brainData.userProfile.business.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Industria</p>
                  <p className="font-medium">{brainData.userProfile.business.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tamaño</p>
                  <Badge variant="secondary">{brainData.userProfile.business.size}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Etapa de crecimiento</p>
                  <Badge variant="outline">{brainData.userProfile.business.growthStage}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos y Preferencias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Objetivos Principales</p>
                  <div className="flex flex-wrap gap-2">
                    {brainData.userProfile.goals.primary.map((goal, index) => (
                      <Badge key={index} variant="default">{goal}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Objetivos Secundarios</p>
                  <div className="flex flex-wrap gap-2">
                    {brainData.userProfile.goals.secondary.map((goal, index) => (
                      <Badge key={index} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="font-medium">{brainData.userProfile.goals.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prioridad</p>
                    <Badge>{brainData.userProfile.goals.priority}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* INSIGHTS TAB */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Insights Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="space-y-3">
                    {brainData.knowledgeBase.insights.map((insight) => (
                      <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{insight.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.source}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Progress value={insight.confidence * 100} className="w-12 h-2" />
                            <span className="text-xs text-gray-600">
                              {formatDate(insight.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patrones Detectados</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="space-y-3">
                    {brainData.knowledgeBase.patterns.map((pattern) => (
                      <div key={pattern.id} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">{pattern.pattern}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary">
                            {pattern.frequency}x veces
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {formatDate(pattern.lastSeen)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* RELATIONSHIPS TAB */}
        <TabsContent value="relationships" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(brainData.relationships).map((rel) => (
              <Card key={rel.assistantId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{rel.assistantId}</span>
                    <Badge variant="outline">
                      {(rel.trustLevel * 100).toFixed(0)}% confianza
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Interacciones</p>
                    <p className="font-medium">{rel.interactionCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tareas exitosas</p>
                    <Progress 
                      value={(rel.successfulTasks / rel.interactionCount) * 100} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Satisfacción</p>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{rel.userSatisfaction.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">/5.0</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Áreas de expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {rel.expertiseAreas.slice(0, 2).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-4">
          <div className="space-y-4">
            {brainData.knowledgeBase.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'completed' ? 'secondary' :
                      project.status === 'paused' ? 'outline' : 'destructive'
                    }>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Inicio</p>
                      <p className="font-medium">{formatDate(project.startDate)}</p>
                    </div>
                    {project.targetDate && (
                      <div>
                        <p className="text-sm text-gray-600">Meta</p>
                        <p className="font-medium">{formatDate(project.targetDate)}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Asistentes involucrados</p>
                    <div className="flex gap-2">
                      {project.assistantsInvolved.map((assistantId) => (
                        <Badge key={assistantId} variant="outline">
                          {assistantId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Objetivos</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {project.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tareas Completadas</p>
                    <p className="text-2xl font-bold">{brainData.analytics.totalTasksCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                    <p className="text-2xl font-bold">{brainData.analytics.averageTaskCompletionTime}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Asistente Top</p>
                    <p className="text-2xl font-bold capitalize">{brainData.analytics.mostEffectiveAssistant}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hora Productiva</p>
                    <p className="text-lg font-bold">{brainData.analytics.mostProductiveTimeOfDay}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progreso de Objetivos Mensuales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(brainData.analytics.monthlyGoalProgress).map(([goal, progress]) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
