'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Target,
  Users,
  BarChart
} from 'lucide-react';
import { cerebroAIV2, CerebroInsight, UserProfileData, AssistantRelationship } from '@/lib/cerebro-ai-v2';

interface CerebroInsightsV2Props {
  className?: string;
}

export function CerebroInsightsV2({ className }: CerebroInsightsV2Props) {
  const [insights, setInsights] = useState<CerebroInsight[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [assistantRelationships, setAssistantRelationships] = useState<AssistantRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCerebroData();
  }, []);

  const loadCerebroData = async () => {
    try {
      setIsLoading(true);
      
      const [profile, recentInsights] = await Promise.all([
        cerebroAIV2.getUserProfile(),
        cerebroAIV2.getRecentInsights(5)
      ]);

      setUserProfile(profile);
      setInsights(recentInsights);

      // Cargar relaciones de asistentes (simulado para demo)
      const assistants = ['sofia', 'carlos', 'paula', 'diana', 'alex'];
      const relationships = await Promise.all(
        assistants.map(id => cerebroAIV2.getAssistantRelationship(id))
      );
      
      setAssistantRelationships(relationships.filter(Boolean) as AssistantRelationship[]);
    } catch (error) {
      console.error('Error loading Cerebro data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'opportunity': return <Target className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'behavior': return <Users className="w-4 h-4" />;
      case 'activity': return <BarChart className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-500';
      case 'opportunity': return 'bg-green-500';
      case 'risk': return 'bg-red-500';
      case 'optimization': return 'bg-yellow-500';
      case 'behavior': return 'bg-purple-500';
      case 'activity': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Cerebro AI</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header del Cerebro AI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Cerebro AI</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              ACTIVO
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadCerebroData}
            type="button"
          >
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Perfil del Usuario */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Tu Perfil</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>{userProfile?.name || 'Usuario'}</div>
                <div>{userProfile?.company || 'Mi Empresa'}</div>
                <div className="text-xs">{userProfile?.industry || 'Tecnología'} • {userProfile?.role || 'Emprendedor'}</div>
              </div>
            </div>

            {/* Estilo de Trabajo */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Estilo Detectado</h4>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  {userProfile?.working_style?.replace('-', ' ') || 'Fast-paced'}
                </Badge>
                <div className="text-xs text-gray-600">
                  {userProfile?.communication_prefs || 'Conversacional'}
                </div>
              </div>
            </div>

            {/* Insights Totales */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Insights Generados</h4>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-purple-600">{insights.length}</div>
                <div className="text-xs text-gray-600">últimos días</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>Insights Recientes</span>
          </CardTitle>
          <CardDescription>
            Patrones y oportunidades detectadas por el Cerebro AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div 
                  key={insight.id || index}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${getInsightColor(insight.insight_type)} flex items-center justify-center text-white flex-shrink-0`}>
                    {getInsightIcon(insight.insight_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <Badge variant={getPriorityColor(insight.priority || 'medium') as any} className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {insight.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Por {insight.discovered_by}</span>
                        <span>•</span>
                        <span>Confianza: {Math.round(insight.confidence * 100)}%</span>
                      </div>
                      
                      {insight.actionable && !insight.acted_upon && (
                        <Button variant="outline" size="sm" type="button">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actuar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">El Cerebro AI está aprendiendo...</p>
              <p className="text-xs text-gray-400 mt-1">
                Interactúa con los asistentes para generar insights
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relaciones con Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Relaciones con Asistentes</span>
          </CardTitle>
          <CardDescription>
            Nivel de confianza y eficiencia con cada asistente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assistantRelationships.length > 0 ? (
            <div className="space-y-4">
              {assistantRelationships.map((relationship) => (
                <div 
                  key={relationship.assistant_id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {relationship.assistant_id.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {relationship.assistant_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {relationship.interaction_count} interacciones • {relationship.successful_tasks} exitosas
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {relationship.trust_level}% confianza
                    </div>
                    <Progress 
                      value={relationship.trust_level} 
                      className="w-20 h-2 mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">Construyendo relaciones...</p>
              <p className="text-xs text-gray-400 mt-1">
                Usa los asistentes para desarrollar confianza
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
