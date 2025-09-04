"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CreditCard,
  HelpCircle,
  X,
  Bot,
  Zap,
  Clock,
  Brain
} from "lucide-react";
import { assistants } from "@/lib/assistants";
import { useAssistantStore } from "@/store/assistants";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const { activeAssistant, setActiveAssistant } = useAssistantStore();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: true },
    { name: "Conversaciones", href: "/dashboard/conversations", icon: MessageSquare, current: false },
    { name: "Cerebro AI", href: "/dashboard/brain", icon: Brain, current: false },
    { name: "Cerebro Central", href: "/dashboard/brain/cerebro", icon: Brain, current: false, badge: "NEW" },
    { name: "Automatizaciones", href: "/dashboard/automations", icon: Bot, current: false },
    { name: "Analíticas", href: "/dashboard/analytics", icon: BarChart3, current: false },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings, current: false },
    { name: "Suscripción", href: "/dashboard/billing", icon: CreditCard, current: false },
    { name: "Ayuda", href: "/dashboard/help", icon: HelpCircle, current: false },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Asistentes IA</h1>
            <p className="text-xs text-gray-500">Plan Profesional</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                item.current
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* Active Assistants Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-sm font-medium text-gray-900">Asistentes Principales</h3>
            <Badge variant="secondary" className="text-xs">
              {assistants.length}
            </Badge>
          </div>

          <ScrollArea className="h-64 mt-3 custom-scrollbar">
            <div className="space-y-1">
              {assistants.map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => {
                    setActiveAssistant(assistant);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                    activeAssistant?.id === assistant.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className={`w-8 h-8 rounded-lg ${assistant.color} flex items-center justify-center mr-3 text-sm`}>
                    {assistant.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{assistant.name}</p>
                    <p className="text-xs text-gray-500 truncate">{assistant.role}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 px-3 py-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Uso del mes</h4>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tareas</span>
              <span className="font-medium">2,847 / 5,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57%' }}></div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>Renueva en 12 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
            <p className="text-xs text-gray-500">juan@empresa.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="dashboard-sidebar hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
