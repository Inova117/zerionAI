"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardActivities } from "@/hooks/useDashboardMetrics";
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Bot,
  Zap,
  FileText,
  Settings,
  Trophy,
  Link
} from "lucide-react";
import { assistants } from "@/lib/assistants";

export function RecentActivity() {
  const { activities, isLoading } = useDashboardActivities(8);

  const getAssistantInfo = (assistantId: string) => {
    return assistants.find(a => a.id === assistantId);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "file_generated":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "automation_setup":
        return <Settings className="w-4 h-4 text-purple-500" />;
      case "milestone_reached":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "link_shared":
        return <Link className="w-4 h-4 text-indigo-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityBadge = (type: string, impact?: string) => {
    const impactColor = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    }[impact || 'medium'];

    switch (type) {
      case "task_completed":
        return <Badge className={`${impactColor} hover:${impactColor}`}>Tarea</Badge>;
      case "file_generated":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Archivo</Badge>;
      case "automation_setup":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Automatización</Badge>;
      case "milestone_reached":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Hito</Badge>;
      default:
        return <Badge variant="secondary">Actividad</Badge>;
    }
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ahora mismo';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return timestamp.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Actividad Reciente
          </CardTitle>
          <Button variant="ghost" size="sm">
            Ver todo
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 custom-scrollbar">
          <div className="space-y-4">
            {activities.map((activity) => {
              const assistant = getAssistantInfo(activity.assistant_id) || {
                id: 'system',
                name: 'Sistema',
                avatar: '🤖',
                color: 'bg-gray-100'
              };

              return (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group"
                >
                  {/* Assistant Avatar */}
                  <div className={`w-10 h-10 rounded-lg ${assistant.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                    {assistant.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {activity.description}
                          </h4>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xs text-gray-500">{formatRelativeTime(activity.created_at ? new Date(activity.created_at) : new Date())}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs font-medium text-gray-600">{activity.assistant_name}</span>
                          {activity.metadata?.time_saved && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-green-600 font-medium">
                                +{activity.metadata.time_saved}h ahorradas
                              </span>
                            </>
                          )}
                        </div>
                        {activity.metadata?.file_name && (
                          <div className="flex items-center space-x-2 mt-2">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 truncate">
                              {activity.metadata.file_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end space-y-1">
                        {getActivityBadge(activity.type, activity.metadata?.impact)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            Ver todas las actividades
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
