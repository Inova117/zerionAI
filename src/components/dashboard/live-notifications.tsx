"use client";

import { useState, useEffect } from 'react';
import { useDashboardActivities } from '@/hooks/useDashboardMetrics';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { audioSystem } from '@/lib/audio-system';
import { 
  CheckCircle2, 
  FileText, 
  Settings, 
  Trophy, 
  X,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  activityId: string;
  message: string;
  type: 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached' | 'insight_generated' | 'message_sent' | 'system_event';
  assistantName: string;
  timestamp: Date;
  isRead: boolean;
}

export function LiveNotifications() {
  const { activities } = useDashboardActivities(20);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [lastActivityCount, setLastActivityCount] = useState(0);

  // Convert new activities to notifications
  useEffect(() => {
    if (activities.length > lastActivityCount && lastActivityCount > 0) {
      const newActivities = activities.slice(0, activities.length - lastActivityCount);
      
      const newNotifications = newActivities.map(activity => ({
        id: `notif_${activity.id}_${Date.now()}`,
        activityId: activity.id || `activity_${Date.now()}`,
        message: generateNotificationMessage(activity),
        type: activity.type as 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached' | 'insight_generated' | 'message_sent' | 'system_event',
        assistantName: activity.assistant_name,
        timestamp: activity.created_at ? new Date(activity.created_at) : new Date(),
        isRead: false
      }));

      setNotifications(prev => [...newNotifications, ...prev]);
      
      // Play notification sounds based on activity type
      newNotifications.forEach(notification => {
        setTimeout(() => {
          switch (notification.type) {
            case 'task_completed':
              audioSystem.playTaskComplete();
              break;
            case 'file_generated':
              audioSystem.playSuccess();
              break;
            case 'automation_setup':
              audioSystem.playAutomationTrigger();
              break;
            case 'milestone_reached':
              audioSystem.playMilestone();
              break;
            case 'insight_generated':
              audioSystem.playNotification();
              break;
            case 'message_sent':
              audioSystem.playNotification();
              break;
            case 'system_event':
              audioSystem.playNotification();
              break;
            default:
              audioSystem.playNotification();
          }
        }, Math.random() * 500); // Slight random delay for multiple notifications
      });
    }
    
    setLastActivityCount(activities.length);
  }, [activities, lastActivityCount]);

  // Auto-dismiss notifications after 8 seconds
  useEffect(() => {
    const timers = notifications
      .filter(notif => !notif.isRead && !dismissedIds.has(notif.id))
      .map(notif => 
        setTimeout(() => {
          handleDismiss(notif.id);
        }, 8000)
      );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, dismissedIds]);

  const generateNotificationMessage = (activity: any): string => {
    const assistantName = activity.assistant_name || activity.assistantName || 'Asistente';
    
    const messages = {
      'task_completed': `${assistantName} completó una tarea`,
      'file_generated': `${assistantName} generó un archivo`,
      'automation_setup': `${assistantName} configuró una automatización`,
      'milestone_reached': '🎉 ¡Nuevo hito alcanzado!',
      'insight_generated': `${assistantName} generó un nuevo insight`,
      'message_sent': `${assistantName} envió un mensaje`,
      'system_event': 'Evento del sistema'
    };

    return messages[activity.type as keyof typeof messages] || 'Nueva actividad';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'file_generated':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'automation_setup':
        return <Settings className="w-5 h-5 text-purple-500" />;
      case 'milestone_reached':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'insight_generated':
        return <Bell className="w-5 h-5 text-cyan-500" />;
      case 'message_sent':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'system_event':
        return <Bell className="w-5 h-5 text-gray-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'border-green-200 bg-green-50';
      case 'file_generated':
        return 'border-blue-200 bg-blue-50';
      case 'automation_setup':
        return 'border-purple-200 bg-purple-50';
      case 'milestone_reached':
        return 'border-yellow-200 bg-yellow-50';
      case 'insight_generated':
        return 'border-cyan-200 bg-cyan-50';
      case 'message_sent':
        return 'border-blue-200 bg-blue-50';
      case 'system_event':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleDismiss = (notificationId: string) => {
    setDismissedIds(prev => new Set([...prev, notificationId]));
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const visibleNotifications = notifications
    .filter(notif => !dismissedIds.has(notif.id))
    .slice(0, 3); // Show max 3 notifications

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={cn(
            "p-4 shadow-lg border-l-4 transition-all duration-500 ease-in-out transform hover-lift",
            getNotificationColor(notification.type),
            "notification-enter animate-bounceIn",
            notification.isRead && "opacity-75"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: '600ms'
          }}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.type)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  
                  {/* Find corresponding activity for details */}
                  {(() => {
                    const activity = activities.find(a => a.id === notification.activityId);
                    return activity && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {activity.description}
                      </p>
                    );
                  })()}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0 h-5"
                    >
                      {notification.assistantName}
                    </Badge>
                    
                    {/* Show time saved if available */}
                    {(() => {
                      const activity = activities.find(a => a.id === notification.activityId);
                      return activity?.metadata?.time_saved && (
                        <span className="text-xs text-green-600 font-medium">
                          +{activity.metadata.time_saved}h
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  onClick={() => handleDismiss(notification.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Marcar como leído
                </Button>
                
                {notification.type === 'file_generated' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2"
                  >
                    Descargar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
