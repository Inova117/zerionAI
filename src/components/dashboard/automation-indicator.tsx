"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { backgroundAutomation } from '@/lib/background-automation';
import { 
  Bot, 
  Play, 
  Pause,
  Clock
} from 'lucide-react';

export function AutomationIndicator() {
  const [activeCount, setActiveCount] = useState(0);
  const [isAllPaused, setIsAllPaused] = useState(false);
  const [nextExecution, setNextExecution] = useState<Date | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const automations = backgroundAutomation.getAutomationStatus();
      const activeAutomations = automations.filter(a => a.isActive);
      const nextExecutions = backgroundAutomation.getNextExecutions();
      
      setActiveCount(activeAutomations.length);
      setIsAllPaused(activeAutomations.length === 0);
      setNextExecution(nextExecutions.length > 0 ? nextExecutions[0].nextExecution : null);
    };

    // Initial update
    updateStatus();

    // Update every 30 seconds
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins}min`;
    return `${Math.floor(diffMins / 60)}h`;
  };

  const handleToggleAll = () => {
    if (isAllPaused) {
      backgroundAutomation.resumeAllAutomations();
    } else {
      backgroundAutomation.pauseAllAutomations();
    }
    
    // Update status immediately
    setTimeout(() => {
      const automations = backgroundAutomation.getAutomationStatus();
      const activeAutomations = automations.filter(a => a.isActive);
      setActiveCount(activeAutomations.length);
      setIsAllPaused(activeAutomations.length === 0);
    }, 100);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Bot className="w-5 h-5 text-blue-600" />
          {activeCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>
        
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {activeCount} automatizaciones
          </div>
          {nextExecution && !isAllPaused && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Próxima en {formatTimeUntil(nextExecution)}
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <Badge 
        className={`text-xs ${
          isAllPaused 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}
      >
        {isAllPaused ? 'Pausadas' : 'Activas'}
      </Badge>

      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleAll}
        className="h-8 px-3"
      >
        {isAllPaused ? (
          <>
            <Play className="w-3 h-3 mr-1" />
            Reanudar
          </>
        ) : (
          <>
            <Pause className="w-3 h-3 mr-1" />
            Pausar
          </>
        )}
      </Button>
    </div>
  );
}
