"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { AssistantInfo } from "@/components/dashboard/assistant-info";
import { assistants, getAssistantById, Assistant } from "@/lib/assistants";
import { useAssistantStore } from "@/store/assistants";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const assistantId = searchParams.get('assistant');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const { setActiveAssistant } = useAssistantStore();

  useEffect(() => {
    if (assistantId) {
      const assistant = getAssistantById(assistantId);
      if (assistant) {
        setSelectedAssistant(assistant);
        setActiveAssistant(assistant);
      }
    } else {
      // Default to first assistant if none selected
      setSelectedAssistant(assistants[0]);
      setActiveAssistant(assistants[0]);
    }
  }, [assistantId, setActiveAssistant]);

  if (!selectedAssistant) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Selecciona un asistente
          </h2>
          <p className="text-gray-600">
            Elige un asistente para empezar a conversar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Assistant Info Sidebar */}
      <div className="hidden xl:block w-80 border-r border-gray-200 bg-white flex-shrink-0">
        <AssistantInfo assistant={selectedAssistant} />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface assistant={selectedAssistant} />
      </div>
    </div>
  );
}
