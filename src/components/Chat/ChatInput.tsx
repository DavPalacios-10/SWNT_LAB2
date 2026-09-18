import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, CornerDownLeft } from 'lucide-react';
import { SuggestionChips } from './SuggestionChips';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionSelect = (query: string) => {
    setInputText(query);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-emerald-100 p-3 sm:p-4 rounded-b-2xl shadow-lg">
      {/* Suggestions */}
      <SuggestionChips onSelectSuggestion={handleSuggestionSelect} disabled={isLoading} />

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-2 relative flex items-end bg-stone-50 border border-stone-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200/50 rounded-2xl p-2 transition-all">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder="Escribe tus actividades del día (ej. 'Hoy usamos 3 camionetas diésel 100 km y 150 kWh de luz')..."
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-stone-800 placeholder-stone-400 text-sm resize-none py-1.5 px-2 max-h-32"
        />

        <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => alert('Entrada de voz lista para conectar a la API de reconocimiento de voz de tu navegador.')}
            className="p-2 rounded-xl text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Dictado por voz"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-medium text-xs rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 disabled:opacity-40 disabled:scale-100 flex items-center space-x-1"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Calcular</span>
                <Send className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="flex items-center justify-between text-[11px] text-stone-400 px-2 mt-1">
        <span className="flex items-center">
          <CornerDownLeft className="w-3 h-3 mr-1" /> Presiona Enter para enviar
        </span>
        <span>EcoTrack AI NLP Engine</span>
      </div>
    </div>
  );
};
