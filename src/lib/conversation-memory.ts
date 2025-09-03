interface ConversationMemory {
  assistantId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'task_completion' | 'file_generated' | 'link_shared';
    metadata?: any;
  }>;
  userProfile: {
    name: string;
    company: string;
    industry: string;
    goals: string[];
    previousTasks: string[];
  };
  context: {
    currentProject?: string;
    lastTaskType?: string;
    pendingTasks: string[];
    completedTasks: string[];
    mood?: 'curious' | 'frustrated' | 'excited' | 'professional';
  };
  sessionStartTime: Date;
  totalInteractions: number;
}

class ConversationMemoryManager {
  private storage: { [assistantId: string]: ConversationMemory } = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('conversation_memory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        Object.keys(parsed).forEach(assistantId => {
          parsed[assistantId].sessionStartTime = new Date(parsed[assistantId].sessionStartTime);
          parsed[assistantId].messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
        });
        this.storage = parsed;
      }
    } catch (error) {
      console.warn('Failed to load conversation memory:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('conversation_memory', JSON.stringify(this.storage));
    } catch (error) {
      console.warn('Failed to save conversation memory:', error);
    }
  }

  initializeAssistant(assistantId: string) {
    if (!this.storage[assistantId]) {
      this.storage[assistantId] = {
        assistantId,
        messages: [],
        userProfile: {
          name: "María González",
          company: "Café Luna CDMX",
          industry: "Gastronomía",
          goals: ["Aumentar ventas online", "Mejorar presencia en redes", "Automatizar atención al cliente"],
          previousTasks: []
        },
        context: {
          pendingTasks: [],
          completedTasks: [],
          mood: 'professional'
        },
        sessionStartTime: new Date(),
        totalInteractions: 0
      };
    }
    return this.storage[assistantId];
  }

  addMessage(assistantId: string, role: 'user' | 'assistant', content: string, type: string = 'text', metadata?: any) {
    const memory = this.initializeAssistant(assistantId);
    
    memory.messages.push({
      role,
      content,
      timestamp: new Date(),
      type: type as any,
      metadata
    });

    memory.totalInteractions++;
    
    // Update context based on message
    this.updateContextFromMessage(memory, role, content, type);
    
    this.saveToStorage();
    return memory;
  }

  private updateContextFromMessage(memory: ConversationMemory, role: string, content: string, type: string) {
    if (role === 'user') {
      // Detect user mood and intent
      if (content.toLowerCase().includes('gracias') || content.toLowerCase().includes('perfecto')) {
        memory.context.mood = 'excited';
      } else if (content.toLowerCase().includes('no funciona') || content.toLowerCase().includes('problema')) {
        memory.context.mood = 'frustrated';
      } else if (content.includes('?')) {
        memory.context.mood = 'curious';
      }

      // Extract potential project mentions
      const projectKeywords = ['campaña', 'proyecto', 'lanzamiento', 'estrategia'];
      projectKeywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword)) {
          memory.context.currentProject = content.substring(0, 50) + '...';
        }
      });
    }

    if (role === 'assistant' && type === 'task_completion') {
      memory.context.completedTasks.push(content);
      memory.userProfile.previousTasks.push(content);
    }
  }

  getMemory(assistantId: string): ConversationMemory {
    return this.initializeAssistant(assistantId);
  }

  getRecentMessages(assistantId: string, limit: number = 10) {
    const memory = this.storage[assistantId];
    if (!memory) return [];
    
    return memory.messages.slice(-limit);
  }

  getConversationSummary(assistantId: string): string {
    const memory = this.storage[assistantId];
    if (!memory || memory.messages.length === 0) return "";

    const recentMessages = memory.messages.slice(-5);
    const topics = recentMessages
      .filter(m => m.role === 'user')
      .map(m => m.content.substring(0, 30))
      .join(', ');

    return `Conversación reciente sobre: ${topics}`;
  }

  hasInteractedBefore(assistantId: string): boolean {
    const memory = this.storage[assistantId];
    return memory && memory.messages.length > 0;
  }

  getRelationshipLevel(assistantId: string): 'new' | 'familiar' | 'trusted' {
    const memory = this.storage[assistantId];
    if (!memory || memory.totalInteractions < 3) return 'new';
    if (memory.totalInteractions < 10) return 'familiar';
    return 'trusted';
  }

  markTaskAsCompleted(assistantId: string, task: string) {
    const memory = this.initializeAssistant(assistantId);
    memory.context.completedTasks.push(task);
    memory.context.pendingTasks = memory.context.pendingTasks.filter(t => t !== task);
    this.saveToStorage();
  }

  addPendingTask(assistantId: string, task: string) {
    const memory = this.initializeAssistant(assistantId);
    memory.context.pendingTasks.push(task);
    this.saveToStorage();
  }

  clearMemory(assistantId?: string) {
    if (assistantId) {
      delete this.storage[assistantId];
    } else {
      this.storage = {};
    }
    this.saveToStorage();
  }
}

export const conversationMemory = new ConversationMemoryManager();
