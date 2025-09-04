"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cerebroAI, CerebroMemory } from '@/lib/cerebro-ai';
import { Brain, Lightbulb, TrendingUp, Zap, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export function CerebroInsights() {
  const [memory, setMemory] = useState<CerebroMemory | null>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCerebroData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadCerebroData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCerebroData = () => {
    const cerebroMemory = cerebroAI.getMemory();
    setMemory(cerebroMemory);
  };

  const generatePredictions = async () => {
    setIsLoading(true);
    try {
      const userPredictions = await cerebroAI.predictUserNeeds();
      setPredictions(userPredictions);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!memory) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Brain className="h-8 w-8 text-gray-400 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const recentInsights = memory.crossAssistantInsights
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const activeRelationships = Object.keys(memory.assistantRelationships).length;
  const totalInsights = memory.crossAssistantInsights.length;
  const avgTrustLevel = activeRelationships > 0 
    ? Math.round(Object.values(memory.assistantRelationships)
        .reduce((acc, rel) => acc + rel.trustLevel, 0) / activeRelationships)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">🧠 Cerebro AI</CardTitle>
                <p className="text-sm text-gray-600">Sistema de Inteligencia Central</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={generatePredictions}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                Predecir
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/dashboard/brain/cerebro">
                  Ver Todo
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{totalInsights}</div>
              <div className="text-xs text-gray-600 font-medium">Insights</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{activeRelationships}</div>
              <div className="text-xs text-gray-600 font-medium">Asistentes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{avgTrustLevel}%</div>
              <div className="text-xs text-gray-600 font-medium">Confianza</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Insights Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentInsights.length > 0 ? (
            <div className="space-y-3">
              {recentInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium line-clamp-2">{insight.insight}</p>
                    <Badge 
                      variant={insight.impact === 'high' ? 'default' : 'secondary'}
                      className="ml-2 flex-shrink-0"
                    >
                      {insight.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Por: {insight.discoveredBy}</span>
                    <span>{formatDistanceToNow(new Date(insight.timestamp), { 
                      addSuffix: true, 
                      locale: es 
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No hay insights aún</p>
              <p className="text-xs text-gray-400">Los insights se generarán automáticamente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predictions */}
      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Predicciones IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.immediateNeeds.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Necesidades Inmediatas:</h4>
                  <div className="space-y-1">
                    {predictions.immediateNeeds.slice(0, 2).map((need: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <span className="text-gray-700">{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {predictions.assistantSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Asistente Recomendado:</h4>
                  <div className="border rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {predictions.assistantSuggestions[0].assistant}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Recomendado
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {predictions.assistantSuggestions[0].reason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/brain/cerebro">
                <Brain className="h-3 w-3 mr-1" />
                Ver Cerebro
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={generatePredictions} disabled={isLoading}>
              <Eye className="h-3 w-3 mr-1" />
              Analizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
