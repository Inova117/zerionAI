"use client";

import { useState, useEffect } from 'react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Clock
} from 'lucide-react';

export function ProgressTracker() {
  const { metrics } = useDashboardMetrics();
  const [animatedValues, setAnimatedValues] = useState({
    tasksProgress: 0,
    productivityProgress: 0,
    weeklyStreak: 0
  });

  // Animate progress values
  useEffect(() => {
    const tasksProgress = Math.min(100, (metrics.tasksCompleted / metrics.weeklyGoal) * 100);
    const productivityProgress = metrics.productivity;
    const weeklyStreak = metrics.currentStreak;

    // Animate progress bars
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        callback(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    // Animate tasks progress
    animateValue(animatedValues.tasksProgress, tasksProgress, 1000, (value) => {
      setAnimatedValues(prev => ({ ...prev, tasksProgress: value }));
    });

    // Animate productivity
    setTimeout(() => {
      animateValue(animatedValues.productivityProgress, productivityProgress, 800, (value) => {
        setAnimatedValues(prev => ({ ...prev, productivityProgress: value }));
      });
    }, 300);

    // Animate streak
    setTimeout(() => {
      animateValue(animatedValues.weeklyStreak, weeklyStreak, 600, (value) => {
        setAnimatedValues(prev => ({ ...prev, weeklyStreak: value }));
      });
    }, 600);
  }, [metrics]);

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return 'text-green-600';
    if (productivity >= 75) return 'text-blue-600';
    if (productivity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProductivityBadge = (productivity: number) => {
    if (productivity >= 90) return { text: 'Excelente', color: 'bg-green-100 text-green-700' };
    if (productivity >= 75) return { text: 'Muy bien', color: 'bg-blue-100 text-blue-700' };
    if (productivity >= 60) return { text: 'Bien', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Mejorable', color: 'bg-red-100 text-red-700' };
  };

  const tasksRemaining = Math.max(0, metrics.weeklyGoal - metrics.tasksCompleted);
  const productivityBadge = getProductivityBadge(metrics.productivity);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Goal Progress */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Meta Semanal
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {metrics.tasksCompleted} / {metrics.weeklyGoal}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progreso</span>
              <span className="text-sm font-medium">
                {Math.round(animatedValues.tasksProgress)}%
              </span>
            </div>
            <Progress 
              value={animatedValues.tasksProgress} 
              className="h-3 progress-bar"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {tasksRemaining > 0 ? `${tasksRemaining} tareas restantes` : '¡Meta alcanzada!'}
              </span>
            </div>
            
            {animatedValues.tasksProgress >= 100 && (
              <Badge className="bg-green-100 text-green-700 text-xs animate-pulse">
                🎉 ¡Completado!
              </Badge>
            )}
          </div>

          {/* Time estimate */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            💡 A este ritmo completarás la meta en{' '}
            <span className="font-medium">
              {tasksRemaining <= 0 ? '¡Ya terminaste!' : 
               `~${Math.ceil(tasksRemaining / Math.max(1, metrics.tasksCompleted / 7))} días`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Productivity & Efficiency */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
              Productividad
            </CardTitle>
            <Badge className={`${productivityBadge.color} text-xs`}>
              {productivityBadge.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Eficiencia general</span>
              <span className={`text-sm font-medium ${getProductivityColor(metrics.productivity)}`}>
                {Math.round(animatedValues.productivityProgress)}%
              </span>
            </div>
            <Progress 
              value={animatedValues.productivityProgress} 
              className="h-3 progress-bar"
            />
          </div>

          {/* Metrics breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-gray-600">Racha actual</div>
                <div className="font-medium">{Math.round(animatedValues.weeklyStreak)} días</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-gray-600">Tiempo ahorrado</div>
                <div className="font-medium text-green-600">
                  {metrics.timeSaved.toFixed(1)}h
                </div>
              </div>
            </div>
          </div>

          {/* Performance tip */}
          <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-2 border-l-2 border-blue-200">
            💡 {metrics.productivity >= 90 
              ? '¡Rendimiento excepcional! Sigue así.' 
              : metrics.productivity >= 75 
              ? 'Muy buen ritmo. Considera usar más automatizaciones.'
              : 'Tip: Usa las acciones rápidas para mejorar eficiencia.'
            }
          </div>
        </CardContent>

        {/* Animated background indicator */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
          style={{ width: `${animatedValues.productivityProgress}%` }}
        />
      </Card>
    </div>
  );
}
