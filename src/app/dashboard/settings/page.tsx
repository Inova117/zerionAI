"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { brainAI } from '@/lib/brain-ai';
import { audioSystem } from '@/lib/audio-system';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Volume2, 
  Globe, 
  Clock,
  Save,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    taskComplete: true,
    newMessage: true,
    automation: false,
    weeklyReport: true
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('es');
  const [timezone, setTimezone] = useState('America/Mexico_City');

  useEffect(() => {
    const data = brainAI.getBrainAIData();
    setProfile(data.userProfile);
    setLanguage(data.userProfile.personal.language);
    setTimezone(data.userProfile.personal.timezone);
    
    // Load audio settings
    setAudioVolume(0.5); // Default volume
    setAudioEnabled(true); // Default enabled
  }, []);

  const handleSaveProfile = () => {
    if (profile) {
      brainAI.updateUserProfile({
        ...profile,
        personal: {
          ...profile.personal,
          language,
          timezone
        }
      });
      // Show success notification
      alert('Configuración guardada exitosamente');
    }
  };

  const handleAudioVolumeChange = (value: number[]) => {
    const volume = value[0];
    setAudioVolume(volume);
    audioSystem.setVolume(volume);
  };

  const handleAudioToggle = (enabled: boolean) => {
    setAudioEnabled(enabled);
    audioSystem.setEnabled(enabled);
  };

  const handleTestSound = () => {
    audioSystem.playTaskComplete();
  };

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que quieres restaurar todas las configuraciones por defecto?')) {
      // Reset to defaults
      setAudioVolume(0.7);
      setAudioEnabled(true);
      setNotifications({
        taskComplete: true,
        newMessage: true,
        automation: false,
        weeklyReport: true
      });
      setTheme('system');
      audioSystem.setVolume(0.7);
      audioSystem.setEnabled(true);
    }
  };

  const handleExportData = () => {
    const data = brainAI.getBrainAIData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sintra-ai-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Settings className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia con los asistentes IA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSaveProfile}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacidad
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={profile.personal.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      personal: { ...profile.personal, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personal.email || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      personal: { ...profile.personal, email: e.target.value }
                    })}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                      <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                      <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Negocio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profile.business.company}
                    onChange={(e) => setProfile({
                      ...profile,
                      business: { ...profile.business, company: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industria</Label>
                  <Input
                    id="industry"
                    value={profile.business.industry}
                    onChange={(e) => setProfile({
                      ...profile,
                      business: { ...profile.business, industry: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="size">Tamaño de Empresa</Label>
                  <Select 
                    value={profile.business.size} 
                    onValueChange={(value) => setProfile({
                      ...profile,
                      business: { ...profile.business, size: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10)</SelectItem>
                      <SelectItem value="small">Pequeña (11-50)</SelectItem>
                      <SelectItem value="medium">Mediana (51-200)</SelectItem>
                      <SelectItem value="enterprise">Grande (200+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stage">Etapa de Crecimiento</Label>
                  <Select 
                    value={profile.business.growthStage} 
                    onValueChange={(value) => setProfile({
                      ...profile,
                      business: { ...profile.business, growthStage: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="growth">Crecimiento</SelectItem>
                      <SelectItem value="scale">Escalamiento</SelectItem>
                      <SelectItem value="mature">Maduro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-complete">Tareas Completadas</Label>
                  <p className="text-sm text-gray-600">Recibe notificaciones cuando se complete una tarea</p>
                </div>
                <Switch
                  id="task-complete"
                  checked={notifications.taskComplete}
                  onCheckedChange={(checked) => setNotifications({
                    ...notifications,
                    taskComplete: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-message">Nuevos Mensajes</Label>
                  <p className="text-sm text-gray-600">Notificaciones de respuestas de asistentes</p>
                </div>
                <Switch
                  id="new-message"
                  checked={notifications.newMessage}
                  onCheckedChange={(checked) => setNotifications({
                    ...notifications,
                    newMessage: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="automation">Automatizaciones</Label>
                  <p className="text-sm text-gray-600">Notificaciones de tareas automatizadas</p>
                </div>
                <Switch
                  id="automation"
                  checked={notifications.automation}
                  onCheckedChange={(checked) => setNotifications({
                    ...notifications,
                    automation: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report">Reporte Semanal</Label>
                  <p className="text-sm text-gray-600">Resumen semanal de actividad</p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications({
                    ...notifications,
                    weeklyReport: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema y Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Animaciones</Label>
                  <p className="text-sm text-gray-600">Habilitar animaciones y transiciones</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Compacto</Label>
                  <p className="text-sm text-gray-600">Reduce el espaciado de la interfaz</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIO TAB */}
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sonidos Habilitados</Label>
                  <p className="text-sm text-gray-600">Reproducir sonidos de notificación</p>
                </div>
                <Switch checked={audioEnabled} onCheckedChange={handleAudioToggle} />
              </div>

              <div>
                <Label>Volumen</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Volume2 className="h-4 w-4 text-gray-600" />
                  <Slider
                    value={[audioVolume]}
                    onValueChange={handleAudioVolumeChange}
                    max={1}
                    min={0}
                    step={0.1}
                    className="flex-1"
                    disabled={!audioEnabled}
                  />
                  <span className="text-sm text-gray-600 w-12">
                    {Math.round(audioVolume * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <Button variant="outline" onClick={handleTestSound} disabled={!audioEnabled}>
                  Probar Sonido
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacidad y Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Análisis de Uso</Label>
                  <p className="text-sm text-gray-600">Ayúdanos a mejorar compartiendo datos de uso anónimos</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Personalización</Label>
                  <p className="text-sm text-gray-600">Usar datos para personalizar la experiencia</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button variant="outline" onClick={handleExportData} className="w-full">
                  Exportar Mis Datos
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todos los Datos
                </Button>
                
                <p className="text-xs text-gray-500">
                  Al eliminar tus datos, se borrarán permanentemente todas las conversaciones, 
                  configuraciones y preferencias almacenadas localmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
