"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Zap, Brain, Settings } from 'lucide-react';
import { testAIConnection, getAIServiceStatus } from '@/lib/ai-service';

interface AIStatus {
  mode: 'ai' | 'simulation' | 'hybrid';
  provider: string;
  fallbackEnabled: boolean;
}

interface ConnectionStatus {
  huggingface: { success: boolean; message: string };
  models: Record<string, boolean>;
}

export function AIStatus() {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Get initial status
    const initialStatus = getAIServiceStatus();
    setStatus(initialStatus);
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testAIConnection();
      setConnectionStatus(result);
    } catch (error) {
      console.error('Error testing AI connection:', error);
      setConnectionStatus({
        huggingface: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        models: {}
      });
    } finally {
      setTesting(false);
    }
  };

  if (!status) {
    return null;
  }

  const isAIEnabled = status.mode !== 'simulation';
  const hasHFKey = !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Estado de IA
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestConnection}
          disabled={testing || !isAIEnabled}
          className="h-8"
        >
          {testing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Settings className="h-3 w-3" />
          )}
          Test
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAIEnabled ? (
              <Zap className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm font-medium">
              {status.provider}
            </span>
          </div>
          <Badge 
            variant={status.mode === 'ai' ? 'default' : status.mode === 'hybrid' ? 'secondary' : 'outline'}
          >
            {status.mode.toUpperCase()}
          </Badge>
        </div>

        {/* Configuration Status */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Hugging Face API</span>
            {hasHFKey ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Configurado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <X className="h-3 w-3 mr-1" />
                No configurado
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Fallback</span>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Check className="h-3 w-3 mr-1" />
              Habilitado
            </Badge>
          </div>
        </div>

        {/* Connection Test Results */}
        {connectionStatus && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-xs font-medium text-gray-700">Resultado del Test:</div>
            
            <div className="flex items-center justify-between text-xs">
              <span>Hugging Face</span>
              <Badge 
                variant="outline" 
                className={connectionStatus.huggingface.success 
                  ? "text-green-600 border-green-200" 
                  : "text-red-600 border-red-200"
                }
              >
                {connectionStatus.huggingface.success ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <X className="h-3 w-3 mr-1" />
                )}
                {connectionStatus.huggingface.success ? 'OK' : 'Error'}
              </Badge>
            </div>

            {Object.keys(connectionStatus.models).length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-700">Modelos:</div>
                {Object.entries(connectionStatus.models).map(([model, available]) => (
                  <div key={model} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{model}</span>
                    <Badge 
                      variant="outline" 
                      className={available 
                        ? "text-green-600 border-green-200" 
                        : "text-red-600 border-red-200"
                      }
                    >
                      {available ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      {available ? 'OK' : 'No disponible'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {!connectionStatus.huggingface.success && connectionStatus.huggingface.message && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                {connectionStatus.huggingface.message}
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!hasHFKey && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 Agrega tu API key de Hugging Face en las variables de entorno para usar IA real.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
