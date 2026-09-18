import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/Chat/ChatWindow';
import { ImpactSummary } from './components/Dashboard/ImpactSummary';
import { CategoryChart } from './components/Dashboard/CategoryChart';
import { ActivityHistory } from './components/Dashboard/ActivityHistory';
import { EcoTips } from './components/Dashboard/EcoTips';
import { MethodologyModal } from './components/MethodologyModal';

import { ChatMessage, LogEntry, ActivityCategory } from './types';
import { analizarActividad } from './services/aiInterpreter';
import { calculateEmissions } from './services/emissionCalculator';
import {
  getStoredLogs,
  saveLogs,
  getStoredChat,
  saveChat,
  resetToDemoData,
  clearAllData,
} from './services/storageService';
import { MessageSquare, BarChart3 } from 'lucide-react';

export const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'dashboard'>('chat');

  useEffect(() => {
    const loadedLogs = getStoredLogs();
    const loadedChat = getStoredChat();
    setLogs(loadedLogs);
    setMessages(loadedChat);
  }, []);

  useEffect(() => {
    if (logs.length > 0) saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (messages.length > 0) saveChat(messages);
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: timeStr,
    };

    const assistantMsgId = 'msg_' + Math.random().toString(36).substr(2, 9);
    const tempAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: 'Analizando actividad...',
      timestamp: timeStr,
      isAnalyzing: true,
    };

    setMessages((prev) => [...prev, userMsg, tempAssistantMsg]);
    setIsLoading(true);

    try {
      const analysisResult = await analizarActividad(text);
      const { entities, isRealAI, modelUsed } = analysisResult;

      if (entities.length === 0) {
        const friendlyErrorMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          text: '🌿 No pudimos identificar consumos ni cantidades claras en tu mensaje.\n\nPara ayudarte mejor, intenta incluir valores cuantitativos de tu negocio. Por ejemplo:\n• *"Hoy consumimos 180 kWh de electricidad"*\n• *"Usamos 3 camionetas por 90 km"*\n• *"Generamos 25 kg de cartón en empaques"*\n• *"Gastamos 5 m3 de agua"*',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAnalyzing: false,
        };
        setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? friendlyErrorMsg : m)));
        return;
      }

      const emissionResult = calculateEmissions(entities);

      const logId = 'log_' + Math.random().toString(36).substr(2, 9);
      const categoryTotals: Record<ActivityCategory, number> = {
        transport: 0,
        energy: 0,
        waste: 0,
        water: 0,
        operations: 0,
      };

      emissionResult.items.forEach((item) => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.kgCO2;
      });

      const newLog: LogEntry = {
        id: logId,
        createdAt: now.toISOString(),
        originalText: text,
        totalKgCO2: emissionResult.totalKgCO2,
        items: emissionResult.items,
        categoryTotals,
      };

      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      saveLogs(updatedLogs);

      const aiBadge = isRealAI ? `🤖 ${modelUsed}` : `🌿 EcoTrack AI Engine (Modo Demo)`;
      const finalAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: `${emissionResult.summaryMessage}\n\n*Procesado mediante ${aiBadge}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnalyzing: false,
        emissionResult,
        logId,
      };

      setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? finalAssistantMsg : m)));
    } catch (err) {
      console.error('Error al procesar actividad:', err);
      const errorMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: '🌿 Tuvimos un pequeño inconveniente al analizar tu mensaje. Por favor intenta escribir la actividad nuevamente especificando las cantidades de consumo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnalyzing: false,
      };
      setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? errorMsg : m)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = (logId: string) => {
    const updated = logs.filter((l) => l.id !== logId);
    setLogs(updated);
    saveLogs(updated);
  };

  const handleResetDemo = () => {
    const res = resetToDemoData();
    setLogs(res.logs);
    setMessages(res.chat);
  };

  const handleClearAll = () => {
    if (window.confirm('¿Deseas borrar todo el historial de actividades?')) {
      const res = clearAllData();
      setLogs(res.logs);
      setMessages(res.chat);
    }
  };

  const totalKgCO2 = logs.reduce((acc, l) => acc + l.totalKgCO2, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800 antialiased selection:bg-emerald-200 pb-16 lg:pb-0">
      {/* Header */}
      <Header
        totalKgCO2={totalKgCO2}
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Tab Switcher (< lg screens) */}
        <div className="flex lg:hidden bg-stone-200/70 p-1 rounded-2xl mb-4 text-xs font-semibold text-stone-600">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              mobileTab === 'chat'
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat Conversacional</span>
          </button>
          <button
            onClick={() => setMobileTab('dashboard')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              mobileTab === 'dashboard'
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Dashboard & Huella</span>
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-6.5rem)] lg:min-h-[600px]">
          {/* Left Column: Conversational Chat Interface */}
          <section
            className={`lg:col-span-7 h-[78vh] lg:h-full flex flex-col ${
              mobileTab === 'chat' ? 'block' : 'hidden lg:flex'
            }`}
          >
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </section>

          {/* Right Column: Visual Summary Dashboard */}
          <section
            className={`lg:col-span-5 h-auto lg:h-full overflow-y-auto pr-1 pb-4 space-y-4 ${
              mobileTab === 'dashboard' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ImpactSummary logs={logs} />
            <CategoryChart logs={logs} />
            <ActivityHistory logs={logs} onDeleteLog={handleDeleteLog} />
            <EcoTips />
          </section>
        </div>
      </main>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};

export default App;
