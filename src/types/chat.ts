// Centralized type definitions for chat functionality

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  type?: 'text' | 'task_completion' | 'file_generated' | 'link_shared' | 'list' | 'calendar_update';
  metadata?: any;
  followUpActions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface ChatInterfaceProps {
  assistant: any; // Replace with proper Assistant type when available
}

export interface MessageRendererProps {
  message: Message;
  assistant: any;
  onFollowUpAction?: (action: string) => void;
}
