"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutomationIndicator } from "./automation-indicator";
import { 
  Menu, 
  Bell, 
  Search, 
  Plus,
  Zap,
  MessageSquare
} from "lucide-react";
import { useAssistantStore } from "@/store/assistants";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { activeAssistant, conversations } = useAssistantStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            type="button"
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
        <div className="flex items-center space-x-2">
          {/* Automation Indicator */}
          <div className="hidden lg:block">
            <AutomationIndicator />
          </div>
          
          {/* Stats - Simplified */}
          <div className="hidden lg:flex items-center space-x-3 text-sm text-gray-600 px-3 py-1 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{conversations.length}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              <span>2.8k</span>
            </div>
          </div>

          {/* Essential Actions */}
          <div className="flex items-center space-x-1">
            {/* Quick Actions */}
            <Button type="button" size="sm" variant="outline" className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-1" />
              Nuevo
            </Button>

            {/* Notifications */}
            <Button type="button" variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            {/* Mobile Search Button */}
            <Button type="button" variant="ghost" size="sm" className="sm:hidden">
              <Search className="h-4 w-4" />
            </Button>
          </div>
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
