import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { Leaf, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-stone-50/50 rounded-2xl border border-emerald-100/80 shadow-eco-md overflow-hidden">
      {/* Top Bar for Chat Window */}
      <div className="px-4 py-3 bg-white border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 className="text-sm font-semibold text-stone-800">Asistente Conversacional CO2</h2>
        </div>
        <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-medium">
          Lenguaje Natural Activado
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-700 text-base mb-1">Empieza a registrar tus actividades</h3>
            <p className="text-xs max-w-sm text-stone-500">
              Escribe en texto libre lo que consumió tu negocio hoy (transporte, electricidad, residuos, agua) y calcularemos las emisiones automáticamente.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};
