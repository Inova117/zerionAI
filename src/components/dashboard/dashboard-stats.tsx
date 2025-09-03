"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { 
  TrendingUp, 
  TrendingDown,
  MessageSquare, 
  Zap, 
  Clock, 
  Users,
  Target,
  DollarSign
} from "lucide-react";

export function DashboardStats() {
  const { metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Conversaciones Activas",
      value: metrics.totalInteractions.toString(),
      change: `+${Math.floor(metrics.totalInteractions * 0.15)}`,
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "interacciones totales",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Tareas Completadas",
      value: metrics.tasksCompleted.toString(),
      change: `${Math.floor((metrics.tasksCompleted / metrics.weeklyGoal) * 100)}%`,
      changeType: "positive" as const,
      icon: Zap,
      description: `de ${metrics.weeklyGoal} meta semanal`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Tiempo Ahorrado",
      value: `${metrics.timeSaved.toFixed(1)}h`,
      change: `+${(metrics.timeSaved * 0.2).toFixed(1)}h`,
      changeType: "positive" as const,
      icon: Clock,
      description: "esta semana",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Productividad",
      value: `${Math.floor(metrics.productivity)}%`,
      change: `+${Math.floor(metrics.productivity - 75)}%`,
      changeType: metrics.productivity > 75 ? "positive" as const : "negative" as const,
      icon: Target,
      description: "eficiencia general",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 card-interactive animate-fadeInUp"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-3">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className={`text-xs px-2 py-1 ${
                    stat.changeType === "positive" 
                      ? "bg-green-100 text-green-700 hover:bg-green-100" 
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          </CardContent>
          
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 opacity-5">
            <stat.icon className="w-full h-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
