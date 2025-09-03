"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Download,
  ExternalLink,
  CheckCircle,
  FileText,
  Calendar,
  Link
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'task_completion' | 'file_generated' | 'link_shared' | 'list' | 'calendar_update';
  metadata?: any;
  followUpActions?: Array<{
    label: string;
    action: string;
  }>;
}

interface MessageRendererProps {
  message: Message;
  assistant: any;
  onFollowUpAction?: (action: string) => void;
}

export function MessageRenderer({ message, assistant, onFollowUpAction }: MessageRendererProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'task_completion':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <Badge className="bg-green-100 text-green-700 text-xs">Tarea Completada</Badge>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {message.metadata?.fileName && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {message.metadata.fileName}
                  </span>
                  <Button variant="ghost" size="sm" className="ml-auto h-6 px-2">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'file_generated':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-blue-500" />
              <Badge className="bg-blue-100 text-blue-700 text-xs">Archivo Generado</Badge>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {message.metadata?.fileName && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">
                        {message.metadata.fileName}
                      </p>
                      <p className="text-xs text-blue-600">
                        Archivo listo para descargar
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'link_shared':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Link className="w-4 h-4 text-purple-500" />
              <Badge className="bg-purple-100 text-purple-700 text-xs">Enlace Compartido</Badge>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {message.metadata?.linkUrl && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-purple-900 text-sm">
                      {message.metadata.linkTitle || 'Ver enlace'}
                    </p>
                    <p className="text-xs text-purple-600 truncate">
                      {message.metadata.linkUrl}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {message.metadata?.items && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <ul className="space-y-2">
                  {message.metadata.items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'calendar_update':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-orange-500" />
              <Badge className="bg-orange-100 text-orange-700 text-xs">Calendario Actualizado</Badge>
            </div>
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {message.metadata?.calendarEvent && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900 text-sm">
                      {message.metadata.calendarEvent.title}
                    </p>
                    <p className="text-xs text-orange-600">
                      {message.metadata.calendarEvent.date} a las {message.metadata.calendarEvent.time}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex",
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        )}
      >
        {/* Message Content */}
        {renderMessageContent()}

        {/* Follow-up Actions */}
        {message.followUpActions && message.followUpActions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Acciones sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {message.followUpActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-3"
                  onClick={() => onFollowUpAction?.(action.action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Footer */}
        <div className={cn(
          "flex items-center justify-between mt-3 text-xs",
          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
        )}>
          <span>{formatTime(message.timestamp)}</span>
          {message.role === 'assistant' && (
            <div className="flex items-center space-x-1 ml-4">
              <button className="hover:bg-gray-200 rounded p-1 transition-colors">
                <Copy className="w-3 h-3" />
              </button>
              <button className="hover:bg-gray-200 rounded p-1 transition-colors">
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button className="hover:bg-gray-200 rounded p-1 transition-colors">
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
