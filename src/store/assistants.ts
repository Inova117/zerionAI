import { create } from 'zustand';
import { Assistant } from '@/lib/assistants';
import { Database } from '@/lib/supabase';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

interface AssistantStore {
  // Current state
  activeAssistant: Assistant | null;
  activeConversation: ConversationWithMessages | null;
  conversations: Conversation[];
  isLoading: boolean;
  isTyping: boolean;

  // Actions
  setActiveAssistant: (assistant: Assistant | null) => void;
  setActiveConversation: (conversation: ConversationWithMessages | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  clearActiveConversation: () => void;
}

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  // Initial state
  activeAssistant: null,
  activeConversation: null,
  conversations: [],
  isLoading: false,
  isTyping: false,

  // Actions
  setActiveAssistant: (assistant) => set({ activeAssistant: assistant }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) => 
    set((state) => ({
      conversations: [conversation, ...state.conversations]
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
      activeConversation: state.activeConversation?.id === id
        ? { ...state.activeConversation, ...updates }
        : state.activeConversation
    })),

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      activeConversation: state.activeConversation?.id === id 
        ? null 
        : state.activeConversation
    })),

  addMessage: (message) =>
    set((state) => {
      if (!state.activeConversation) return state;

      return {
        activeConversation: {
          ...state.activeConversation,
          messages: [...state.activeConversation.messages, message]
        }
      };
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setTyping: (typing) => set({ isTyping: typing }),

  clearActiveConversation: () => set({ 
    activeConversation: null,
    activeAssistant: null 
  }),
}));

// Selector hooks for better performance
export const useActiveAssistant = () => useAssistantStore(state => state.activeAssistant);
export const useActiveConversation = () => useAssistantStore(state => state.activeConversation);
export const useConversations = () => useAssistantStore(state => state.conversations);
export const useIsLoading = () => useAssistantStore(state => state.isLoading);
export const useIsTyping = () => useAssistantStore(state => state.isTyping);
