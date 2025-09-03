"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  VolumeX, 
  Volume1,
  Play,
  Settings
} from 'lucide-react';
import { audioSystem } from '@/lib/audio-system';

export function AudioSettings() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load audio settings
    audioSystem.loadSettings();
    const settings = audioSystem.getSettings();
    setIsEnabled(settings.enabled);
    setVolume(Math.round(settings.volume * 100));
  }, []);

  const handleToggleAudio = (enabled: boolean) => {
    setIsEnabled(enabled);
    audioSystem.setEnabled(enabled);
    
    if (enabled) {
      audioSystem.playNotification();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioSystem.setVolume(newVolume / 100);
  };

  const playTestSound = (soundType: string) => {
    switch (soundType) {
      case 'notification':
        audioSystem.playNotification();
        break;
      case 'success':
        audioSystem.playSuccess();
        break;
      case 'task':
        audioSystem.playTaskComplete();
        break;
      case 'error':
        audioSystem.playError();
        break;
      case 'milestone':
        audioSystem.playMilestone();
        break;
    }
  };

  const getVolumeIcon = () => {
    if (!isEnabled) return <VolumeX className="w-4 h-4" />;
    if (volume < 30) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      {/* Audio Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 p-0 hover-scale button-press"
        title="Configuración de audio"
      >
        {getVolumeIcon()}
      </Button>

      {/* Audio Settings Panel */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg animate-fadeInScale">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Settings className="w-5 h-5 mr-2" />
              Configuración de Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Audio */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Efectos de sonido</p>
                <p className="text-xs text-gray-500">
                  Reproducir sonidos para notificaciones y acciones
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleAudio}
              />
            </div>

            {/* Volume Control */}
            {isEnabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Volumen</p>
                  <Badge variant="outline" className="text-xs">
                    {volume}%
                  </Badge>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}

            {/* Test Sounds */}
            {isEnabled && (
              <div className="space-y-3">
                <p className="font-medium text-sm">Probar sonidos</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playTestSound('notification')}
                    className="text-xs button-press"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Notificación
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playTestSound('success')}
                    className="text-xs button-press"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Éxito
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playTestSound('task')}
                    className="text-xs button-press"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Tarea
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playTestSound('milestone')}
                    className="text-xs button-press"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Hito
                  </Button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full text-xs"
              >
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
