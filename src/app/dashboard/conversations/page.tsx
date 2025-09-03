"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { conversationMemory } from '@/lib/conversation-memory';
import { assistants } from '@/lib/assistants';
import { MessageSquare, Search, Calendar, Clock, User, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface ConversationSummary {
  assistantId: string;
  assistantName: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  status: 'active' | 'idle' | 'archived';
  avatar: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'idle' | 'archived'>('all');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const conversationData: ConversationSummary[] = assistants.map(assistant => {
      const memory = conversationMemory.getMemory(assistant.id);
      const lastMessage = memory.messages.length > 0 
        ? memory.messages[memory.messages.length - 1]
        : null;

      const hoursAgo = lastMessage 
        ? (Date.now() - new Date(lastMessage.timestamp).getTime()) / (1000 * 60 * 60)
        : 999;

      return {
        assistantId: assistant.id,
        assistantName: assistant.name,
        lastMessage: lastMessage ? lastMessage.content.substring(0, 100) + '...' : 'Sin mensajes aún',
        timestamp: lastMessage ? new Date(lastMessage.timestamp) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        messageCount: memory.messages.length,
        status: hoursAgo < 1 ? 'active' : hoursAgo < 24 ? 'idle' : 'archived',
        avatar: assistant.avatar
      };
    });

    setConversations(conversationData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.assistantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || conv.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours < 24) return `Hace ${hours} horas`;
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'idle': return 'Inactivo';
      case 'archived': return 'Archivado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Conversaciones</h1>
            <p className="text-gray-600">Historial y gestión de todas tus conversaciones con asistentes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {filteredConversations.length} conversaciones
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={activeFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('active')}
              >
                Activas
              </Button>
              <Button
                variant={activeFilter === 'idle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('idle')}
              >
                Inactivas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron conversaciones
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza una conversación con algún asistente'}
              </p>
              <Link href="/dashboard">
                <Button>Ir al Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card key={conversation.assistantId} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/dashboard/chat?assistant=${conversation.assistantId}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl">{conversation.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{conversation.assistantName}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(conversation.status)}`}
                          >
                            {getStatusText(conversation.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(conversation.timestamp)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.messageCount} mensajes
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {conversation.status === 'active' && (
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversaciones Activas</p>
                <p className="text-2xl font-bold">
                  {conversations.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Mensajes</p>
                <p className="text-2xl font-bold">
                  {conversations.reduce((sum, c) => sum + c.messageCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Actividad</p>
                <p className="text-sm font-medium">
                  {conversations.length > 0 
                    ? formatRelativeTime(conversations[0].timestamp)
                    : 'Sin actividad'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
