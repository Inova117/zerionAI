"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  MoreVertical, 
  Zap, 
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import { assistants } from "@/lib/assistants";
import { useAssistantStore } from "@/store/assistants";
import { cn } from "@/lib/utils";
import { audioSystem } from "@/lib/audio-system";

export function AssistantGrid() {
  const { activeAssistant, setActiveAssistant } = useAssistantStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleAssistantClick = (assistant: any) => {
    audioSystem.playButtonClick();
    setActiveAssistant(assistant);
    window.location.href = `/dashboard/chat?assistant=${assistant.id}`;
  };

  // Simulated stats for each assistant
  const getAssistantStats = (assistantId: string) => {
    const stats = {
      sofia: { conversations: 23, tasksCompleted: 156, efficiency: 94 },
      carlos: { conversations: 45, tasksCompleted: 289, efficiency: 97 },
      diana: { conversations: 12, tasksCompleted: 78, efficiency: 91 },
      bruno: { conversations: 8, tasksCompleted: 34, efficiency: 89 },
      elena: { conversations: 19, tasksCompleted: 127, efficiency: 93 },
      gabriel: { conversations: 15, tasksCompleted: 92, efficiency: 88 },
      paula: { conversations: 31, tasksCompleted: 198, efficiency: 96 },
      samuel: { conversations: 6, tasksCompleted: 21, efficiency: 85 },
      sergio: { conversations: 14, tasksCompleted: 89, efficiency: 92 },
      marina: { conversations: 38, tasksCompleted: 245, efficiency: 95 },
      miguel: { conversations: 17, tasksCompleted: 103, efficiency: 90 },
      carmen: { conversations: 22, tasksCompleted: 134, efficiency: 93 },
    };
    return stats[assistantId as keyof typeof stats] || { conversations: 0, tasksCompleted: 0, efficiency: 0 };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assistants.map((assistant, index) => {
        const stats = getAssistantStats(assistant.id);
        const isActive = activeAssistant?.id === assistant.id;
        const isHovered = hoveredCard === assistant.id;

        return (
          <Card
            key={assistant.id}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ripple animate-fadeInScale",
              isActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-300",
              "transform hover:-translate-y-1"
            )}
            style={{ animationDelay: `${index * 0.15}s` }}
            onMouseEnter={() => setHoveredCard(assistant.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleAssistantClick(assistant)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300",
                      assistant.color,
                      isHovered && "scale-110"
                    )}
                  >
                    {assistant.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {assistant.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">
                      {assistant.role}
                    </p>
                  </div>
                </div>

                {/* Status and Menu */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 ml-1 font-medium">En línea</span>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Efficiency Badge */}
              <div className="flex items-center justify-between mt-3">
                <Badge 
                  variant={stats.efficiency >= 95 ? "default" : stats.efficiency >= 90 ? "secondary" : "outline"}
                  className="text-xs"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {stats.efficiency}% eficiencia
                </Badge>
                {isActive && (
                  <Badge className="bg-blue-600 text-white text-xs animate-pulse">
                    Activo
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {assistant.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-lg font-bold">{stats.conversations}</span>
                  </div>
                  <p className="text-xs text-gray-500">Conversaciones</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-lg font-bold">{stats.tasksCompleted}</span>
                  </div>
                  <p className="text-xs text-gray-500">Tareas</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {assistant.specialties.slice(0, 2).map((specialty, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs px-2 py-0"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {assistant.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{assistant.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  className={cn(
                    "flex-1 transition-all duration-200",
                    isActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"
                  )}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isActive ? "Continuar" : "Chatear"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>

              {/* Last Activity */}
              <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Clock className="w-3 h-3 mr-1" />
                <span>Última actividad: hace 2 min</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
