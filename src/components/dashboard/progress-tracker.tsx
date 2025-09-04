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
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Calculate static values
  const tasksProgress = Math.min(100, (metrics.tasksCompleted / metrics.weeklyGoal) * 100);
  const productivityProgress = metrics.productivity;
  const weeklyStreak = metrics.currentStreak;
  
  const [animatedValues, setAnimatedValues] = useState({
    tasksProgress: tasksProgress,
    productivityProgress: productivityProgress,
    weeklyStreak: weeklyStreak
  });

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Animate progress values only after hydration
  useEffect(() => {
    if (!isHydrated) return;

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
    animateValue(0, tasksProgress, 1000, (value) => {
      setAnimatedValues(prev => ({ ...prev, tasksProgress: value }));
    });

    // Animate productivity
    setTimeout(() => {
      animateValue(0, productivityProgress, 800, (value) => {
        setAnimatedValues(prev => ({ ...prev, productivityProgress: value }));
      });
    }, 300);

    // Animate streak
    setTimeout(() => {
      animateValue(0, weeklyStreak, 600, (value) => {
        setAnimatedValues(prev => ({ ...prev, weeklyStreak: value }));
      });
    }, 600);
  }, [isHydrated, tasksProgress, productivityProgress, weeklyStreak]);

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

  const staticTasksRemaining = 13; // Valor estático para SSR
  const tasksRemaining = isHydrated ? Math.max(0, metrics.weeklyGoal - metrics.tasksCompleted) : staticTasksRemaining;
  const productivityBadge = getProductivityBadge(metrics.productivity);

  return (
    <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Meta Semanal
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {isHydrated ? `${metrics.tasksCompleted} / ${metrics.weeklyGoal}` : "12 / 25"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progreso</span>
              <span className="text-sm font-medium">
                {isHydrated ? Math.round(animatedValues.tasksProgress) : "48"}%
              </span>
            </div>
            <Progress 
              value={isHydrated ? animatedValues.tasksProgress : 48} 
              className="h-3 progress-bar"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {isHydrated 
                  ? (tasksRemaining > 0 ? `${tasksRemaining} tareas restantes` : '¡Meta alcanzada!')
                  : "13 tareas restantes"
                }
              </span>
            </div>
            
            {(isHydrated ? animatedValues.tasksProgress : 48) >= 100 && (
              <Badge className="bg-green-100 text-green-700 text-xs animate-pulse">
                🎉 ¡Completado!
              </Badge>
            )}
          </div>

          {/* Time estimate */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            💡 A este ritmo completarás la meta en{' '}
            <span className="font-medium">
              {isHydrated 
                ? (tasksRemaining <= 0 ? '¡Ya terminaste!' : 
                   `~${Math.ceil(tasksRemaining / Math.max(1, metrics.tasksCompleted / 7))} días`)
                : "~8 días"
              }
            </span>
          </div>
          
          {/* Metrics breakdown */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(isHydrated ? animatedValues.weeklyStreak : weeklyStreak)}
              </div>
              <div className="text-xs text-gray-600">días racha</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {isHydrated ? `${metrics.timeSaved.toFixed(1)}h` : "8.5h"}
              </div>
              <div className="text-xs text-gray-600">ahorradas</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(isHydrated ? animatedValues.productivityProgress : productivityProgress)}%
              </div>
              <div className="text-xs text-gray-600">eficiencia</div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
