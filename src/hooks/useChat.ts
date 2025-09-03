import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/auth-provider';
import { Database } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type Message = Database['public']['Tables']['messages']['Row'];
type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ChatMessage extends Omit<Message, 'metadata'> {
  metadata?: {
    type?: 'text' | 'task' | 'file' | 'link';
    task_status?: 'pending' | 'completed' | 'failed';
    file_url?: string;
    link_url?: string;
    follow_up_actions?: string[];
  };
}

export function useChat(assistantId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const supabase = createClient() as any;

  // Load or create conversation
  useEffect(() => {
    if (!user || !assistantId) return;

    const loadConversation = async () => {
      try {
        // Try to find existing conversation
        let { data: existingConv, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .eq('assistant_id', assistantId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading conversation:', error);
          return;
        }

        // Create new conversation if none exists
        if (!existingConv) {
          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert({
              user_id: user.id,
              assistant_id: assistantId,
              title: `Chat con ${assistantId}`,
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
            toast.error('Error al crear conversación');
            return;
          }

          existingConv = newConv;
        }

        if (existingConv) {
          setConversation(existingConv);
          await loadMessages(existingConv.id);
        }
      } catch (error) {
        console.error('Error in loadConversation:', error);
        toast.error('Error al cargar conversación');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [user, assistantId, supabase]);

  // Load messages for conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    if (!conversation) return;

    const subscription = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload: any) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((current) => {
            // Avoid duplicates
            if (current.some(msg => msg.id === newMessage.id)) {
              return current;
            }
            return [...current, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversation, supabase]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation || !user || sending) return;

    setSending(true);
    
    try {
      // Add user message
      const userMessage = {
        id: uuidv4(),
        conversation_id: conversation.id,
        role: 'user',
        content,
        message_type: 'text',
        metadata: null,
        created_at: new Date().toISOString(),
      };

      const { error: userMsgError } = await supabase
        .from('messages')
        .insert([userMessage]);

      if (userMsgError) {
        throw userMsgError;
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversation.id);

      // Simulate AI response (replace with real AI service later)
      setTimeout(async () => {
        const aiResponse = generateAIResponse(content, assistantId);
        
        const assistantMessage = {
          id: uuidv4(),
          conversation_id: conversation.id,
          role: 'assistant',
          content: aiResponse.content,
          message_type: aiResponse.type,
          metadata: aiResponse.metadata,
          created_at: new Date().toISOString(),
        };

        await supabase
          .from('messages')
          .insert([assistantMessage]);

        // Update user metrics
        await updateUserMetrics();
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  }, [conversation, user, sending, supabase]);

  // Update user metrics after completing tasks
  const updateUserMetrics = async () => {
    if (!user) return;

    try {
      const { data: metrics } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (metrics) {
        await supabase
          .from('user_metrics')
          .update({
            conversations_count: (metrics.conversations_count || 0) + 1,
            tasks_completed: (metrics.tasks_completed || 0) + 1,
            time_saved_hours: (metrics.time_saved_hours || 0) + Math.floor(Math.random() * 3) + 1,
            last_updated: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  };

  return {
    messages,
    conversation,
    loading,
    sending,
    sendMessage,
  };
}

// Simulate AI response generation
function generateAIResponse(userMessage: string, assistantId: string) {
  const responses = {
    sofia: {
      content: `¡Perfecto! He analizado tu solicitud "${userMessage}". Voy a crear contenido para redes sociales optimizado para tu audiencia LATAM. Dame unos minutos para generar posts creativos que generen engagement.`,
      type: 'task',
      metadata: {
        type: 'task',
        task_status: 'completed',
        follow_up_actions: [
          'Ver contenido generado',
          'Programar publicaciones',
          'Analizar métricas'
        ]
      }
    },
    carlos: {
      content: `Entendido. He procesado tu consulta sobre "${userMessage}". Estoy configurando respuestas automáticas para WhatsApp Business y creando un flujo de atención 24/7 para tus clientes.`,
      type: 'task',
      metadata: {
        type: 'task',
        task_status: 'completed',
        follow_up_actions: [
          'Configurar WhatsApp',
          'Ver flujo de atención',
          'Revisar reportes'
        ]
      }
    },
    paula: {
      content: `¡Excelente! Para "${userMessage}" voy a crear copy persuasivo que convierta. Incluiré headlines atractivos, calls-to-action efectivos y adaptaré el tono para tu audiencia específica.`,
      type: 'task',
      metadata: {
        type: 'task',
        task_status: 'completed',
        follow_up_actions: [
          'Ver copy generado',
          'Editar textos',
          'Usar en campañas'
        ]
      }
    }
  };

  const response = responses[assistantId as keyof typeof responses];
  return response || {
    content: `He recibido tu mensaje: "${userMessage}". Estoy procesando la información y preparando una respuesta especializada.`,
    type: 'text',
    metadata: { type: 'text' }
  };
}
