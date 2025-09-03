"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutomationIndicator } from "./automation-indicator";
import { ThemeToggle } from "./theme-toggle";
import { AudioSettings } from "./audio-settings";
import { AIStatus } from "./ai-status";
import { 
  Menu, 
  Bell, 
  Search, 
  Plus,
  Zap,
  MessageSquare,
  Brain
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAssistantStore } from "@/store/assistants";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { activeAssistant, conversations } = useAssistantStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar conversaciones, asistentes..."
              className="bg-transparent border-none outline-none text-sm flex-1 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Active Assistant Indicator */}
          {activeAssistant && (
            <div className="hidden md:flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <div className={`w-6 h-6 rounded ${activeAssistant.color} flex items-center justify-center text-sm mr-2`}>
                {activeAssistant.avatar}
              </div>
              <span className="text-sm font-medium text-blue-900">
                Chateando con {activeAssistant.name}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Automation Indicator */}
          <div className="hidden lg:block">
            <AutomationIndicator />
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{conversations.length} conversaciones</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              <span>2,847 tareas</span>
            </div>
          </div>

          {/* AI Status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="button-press">
                <Brain className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AIStatus />
            </PopoverContent>
          </Popover>

          {/* Audio Settings */}
          <AudioSettings />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Quick Actions */}
          <Button size="sm" className="hidden sm:flex button-press">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Conversación
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative button-press">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse-soft"
            >
              3
            </Badge>
          </Button>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Active Assistant */}
      {activeAssistant && (
        <div className="md:hidden mt-3 flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <div className={`w-6 h-6 rounded ${activeAssistant.color} flex items-center justify-center text-sm mr-2`}>
            {activeAssistant.avatar}
          </div>
          <span className="text-sm font-medium text-blue-900">
            Chateando con {activeAssistant.name}
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
        </div>
      )}
    </header>
  );
}
