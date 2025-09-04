"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { AssistantInfo } from "@/components/dashboard/assistant-info";
import { assistants, getAssistantById, Assistant } from "@/lib/assistants";
import { useAssistantStore } from "@/store/assistants";

function ChatPageContent() {
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
      {/* Assistant Info Sidebar - Desktop */}
      <div className="hidden lg:block w-80 border-r border-gray-200 bg-white flex-shrink-0">
        <AssistantInfo assistant={selectedAssistant} />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Assistant Header */}
        <div className="lg:hidden border-b border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl ${selectedAssistant.color} flex items-center justify-center text-lg`}>
              {selectedAssistant.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedAssistant.name}</h3>
              <p className="text-sm text-gray-600">{selectedAssistant.role}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">En línea</span>
            </div>
          </div>
        </div>
        
        <ChatInterface assistant={selectedAssistant} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>}>
      <ChatPageContent />
    </Suspense>
  );
}
