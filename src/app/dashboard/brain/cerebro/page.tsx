"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cerebroAIV2 } from '@/lib/cerebro-ai-v2';
import { Brain, Zap, TrendingUp, Users, Target, Lightbulb, Activity, RefreshCw, Eye, BarChart3 } from 'lucide-react';

export default function CerebroAIPage() {
  const [cerebroData, setCerebroData] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCerebroData();
  }, []);

  const loadCerebroData = async () => {
    setIsLoading(true);
    try {
      const userId = await cerebroAIV2.getCurrentUserId();
      if (userId) {
        const userProfile = await cerebroAIV2.getUserProfile();
        const insights = await cerebroAIV2.getRecentInsights(10);

        setCerebroData({
          userProfile,
          insights,
          userId
        });
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading Cerebro AI V2 data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      if (cerebroData?.userId) {
        // Simular análisis (en el futuro se conectará a IA real)
        console.log('Realizando análisis manual del Cerebro AI...');

        // Simular predicciones (en el futuro será IA real)
        setPredictions({
          immediateNeeds: ['Optimizar flujo de trabajo', 'Mejorar métricas'],
          upcomingOpportunidades: ['Automatización avanzada', 'Nuevas integraciones'],
          recommendedActions: ['Revisar configuraciones', 'Actualizar preferencias']
        });
      }
      
      // Recargar datos
      await loadCerebroData();
    } catch (error) {
      console.error('Error in Cerebro analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading || !cerebroData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Cargando Cerebro AI V2...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">🧠 Cerebro AI</h2>
              <p className="text-gray-600">Sistema Central de Inteligencia</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={performAnalysis} 
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Analizando...' : 'Analizar Comportamiento'}
            </Button>
            <Button variant="outline" onClick={loadCerebroData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights Generados</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cerebroData?.insights?.length || 0}</div>
              <p className="text-xs text-gray-500">Descubrimientos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistentes Conectados</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">Relaciones activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500">En seguimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel de Aprendizaje</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <Progress value={87} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="assistants">Asistentes</TabsTrigger>
            <TabsTrigger value="patterns">Patrones</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Perfil del Usuario */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Perfil del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-lg">{cerebroData?.userProfile?.name || 'Usuario'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Empresa</label>
                    <p className="text-lg">{cerebroData?.userProfile?.company || 'Empresa no configurada'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Industria</label>
                    <p className="text-lg">{cerebroData?.userProfile?.industry || 'Industria no configurada'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rol</label>
                    <p className="text-lg">{cerebroData?.userProfile?.role || 'Rol no configurado'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estilo de Trabajo</label>
                    <Badge variant="outline" className="mt-1">
                      {cerebroData?.userProfile?.working_style || 'No configurado'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Comunicación</label>
                    <Badge variant="outline" className="mt-1">
                      {cerebroData?.userProfile?.communication_prefs || 'No configurado'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contexto de Negocio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Contexto de Negocio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Desafíos Actuales</h4>
                    {[].length > 0 ? (
                      <div className="space-y-1">
                        {[].map((challenge, idx) => (
                          <Badge key={idx} variant="destructive" className="mr-1 mb-1">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No hay desafíos registrados</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Oportunidades</h4>
                    {[].length > 0 ? (
                      <div className="space-y-1">
                        {[].map((opportunity, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                            {opportunity}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No hay oportunidades registradas</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Insights Descubiertos
                </CardTitle>
                <CardDescription>
                  Patrones y descubrimientos del análisis cruzado de asistentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500">
                  Los insights del Cerebro AI V2 se mostrarán aquí una vez configurado Supabase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relaciones con Asistentes */}
          <TabsContent value="assistants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Relaciones con Asistentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500">
                  Las relaciones con asistentes se mostrarán aquí una vez configurado Supabase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predicciones */}
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Predicciones Inteligentes
                </CardTitle>
                <CardDescription>
                  Análisis predictivo basado en patrones de comportamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictions ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Necesidades Inmediatas</h4>
                      <div className="space-y-2">
                        {predictions.immediateNeeds.map((need: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            <span>{need}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Asistentes Recomendados</h4>
                      <div className="space-y-2">
                        {predictions.assistantSuggestions.map((suggestion: any, idx: number) => (
                          <div key={idx} className="border rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">{suggestion.assistant}</span>
                              <Badge variant="outline">Recomendado</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No hay predicciones disponibles</p>
                    <Button onClick={performAnalysis} className="mt-4">
                      Generar Predicciones
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics del Cerebro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Última Actualización</h4>
                    <p className="text-sm text-gray-600">
                      {format(lastUpdate, 'PPpp', { locale: es })}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Estado del Sistema</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Memoria Activa</span>
                          <Badge variant="default">Activa</Badge>
                        </div>
                      </div>
                      <div className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Aprendizaje</span>
                          <Badge variant={isAnalyzing ? "default" : "secondary"}>
                            {isAnalyzing ? "Procesando" : "En Espera"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
