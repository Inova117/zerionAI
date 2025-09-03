"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MoreVertical, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Paperclip,
  Smile,
  Zap
} from "lucide-react";
import { simulateAIResponse, generateConversationTitle } from "@/lib/ai-service";
import { SmartResponse } from "@/lib/smart-responses";
import { useAssistantStore } from "@/store/assistants";
import { useChat } from "@/hooks/useChat";
import { Assistant } from "@/lib/assistants";
import { cn } from "@/lib/utils";
import { MessageRenderer } from "./message-renderer";
import { audioSystem } from "@/lib/audio-system";

interface ChatInterfaceProps {
  assistant: Assistant;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  type?: 'text' | 'task_completion' | 'file_generated' | 'link_shared' | 'list';
  metadata?: any;
  followUpActions?: Array<{
    label: string;
    action: string;
  }>;
}

export function ChatInterface({ assistant }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isTyping, setTyping } = useAssistantStore();

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Welcome message when assistant changes
  useEffect(() => {
    // Clear previous messages and show intelligent welcome
    setMessages([]);
    
    // Simulate initial loading and then show welcome
    setTimeout(async () => {
      try {
        const welcomeResponse = await simulateAIResponse(
          assistant,
          "¡Hola! Soy nuevo usuario",
          []
        );

        const welcomeMessage: Message = {
          id: "welcome",
          content: welcomeResponse.content,
          role: 'assistant',
          timestamp: new Date(),
          type: welcomeResponse.type,
          metadata: welcomeResponse.metadata,
          followUpActions: welcomeResponse.followUpActions
        };

        setMessages([welcomeMessage]);
      } catch (error) {
        // Fallback welcome message
        setMessages([{
          id: "welcome",
          content: `¡Hola! Soy ${assistant.name}, tu ${assistant.role}. ${assistant.description.split('.')[0]}. ¿En qué puedo ayudarte hoy?`,
          role: 'assistant',
          timestamp: new Date()
        }]);
      }
    }, 800);
  }, [assistant]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Play message sent sound
    audioSystem.playMessageSent();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setTyping(true);

    try {
      // Simulate AI response with enhanced intelligence
      const smartResponse = await simulateAIResponse(
        assistant, 
        userMessage.content, 
        messages.filter(m => m.role === 'user')
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: smartResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        type: smartResponse.type,
        metadata: smartResponse.metadata,
        followUpActions: smartResponse.followUpActions
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Play appropriate sound based on response type
      if (smartResponse.type === 'task_completion') {
        audioSystem.playTaskComplete();
      } else {
        audioSystem.playMessageReceived();
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      audioSystem.playError();
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFollowUpAction = async (action: string) => {
    // Simulate follow-up action
    const actionMessages: { [key: string]: string } = {
      'create_content_strategy': 'Quiero que crees una estrategia de contenido completa',
      'audit_social_media': 'Analiza mi presencia actual en redes sociales',
      'setup_whatsapp': 'Configura mi WhatsApp Business automático',
      'write_sales_email': 'Escribe un email de ventas para mi producto',
      'view_calendar': 'Muéstrame el calendario que creaste',
      'schedule_posts': 'Programa estos posts automáticamente',
      'view_auto_responses': 'Muéstrame las respuestas automáticas configuradas'
    };

    const message = actionMessages[action] || `Ejecutar acción: ${action}`;
    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${assistant.color} flex items-center justify-center text-lg`}>
            {assistant.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{assistant.name}</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 ml-1">En línea</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{assistant.role}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Simulado
          </Badge>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageRenderer
              key={message.id}
              message={message}
              assistant={assistant}
              onFollowUpAction={handleFollowUpAction}
            />
          ))}

          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeInUp">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200 hover-lift">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded ${assistant.color} flex items-center justify-center text-xs animate-pulse-soft`}>
                    {assistant.avatar}
                  </div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {assistant.name} está escribiendo...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Escribe un mensaje a ${assistant.name}...`}
                className="pr-20 py-3 resize-none rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
              <span>{inputMessage.length}/1000</span>
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
