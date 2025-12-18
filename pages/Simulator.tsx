
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { COURSE_SYSTEM_INSTRUCTION } from '../data/courseInstructions';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Simulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Hello! Let's practice. Where are you? --- Olá! Vamos praticar. Onde você está agora? (Ex: At the hotel, at a restaurant...)" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { speak, cancel, isPlaying } = useSpeech();
  const { isListening, transcript, startListening, stopListening, isSupported: voiceSupported } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    }
  }, [transcript]);

  useEffect(() => {
    if (!isPlaying) {
      setActiveMessageId(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cleanTextForSpeech = (text: string) => {
    const englishPart = text.split('---')[0];
    return englishPart.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const handleSpeakToggle = (text: string, id: number) => {
    if (isPlaying && activeMessageId === id) {
      cancel();
      setActiveMessageId(null);
    } else {
      const cleanText = cleanTextForSpeech(text);
      setActiveMessageId(id);
      speak(cleanText);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (isListening) stopListening();

    const userMessage: Message = { role: 'user', text };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Cria instância nova para garantir uso da chave mais recente
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: currentMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: COURSE_SYSTEM_INSTRUCTION,
        },
      });

      const aiText = response.text || "I'm sorry, can you repeat? --- Desculpe, pode repetir?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      
      const cleanAiText = cleanTextForSpeech(aiText);
      setActiveMessageId(currentMessages.length);
      speak(cleanAiText);

    } catch (error: any) {
      console.error("Gemini Error:", error);
      
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        const win = window as any;
        if (win.aistudio?.openSelectKey) {
           await win.aistudio.openSelectKey();
           setMessages(prev => [...prev, { role: 'model', text: "API key updated. Please send your message again! --- Chave de API atualizada. Envie sua mensagem novamente!" }]);
        } else {
           setMessages(prev => [...prev, { role: 'model', text: "API key missing or invalid. Check your Secrets! --- Chave de API ausente ou inválida. Verifique os Secrets do Replit!" }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again later. --- Erro de conexão. Tente novamente em instantes!" }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden border border-slate-100">
      <div className="bg-brand-dark p-4 flex items-center gap-3 border-b border-slate-700">
        <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-xl shadow-lg">🤖</div>
        <div>
          <h3 className="text-white font-bold">Simulador de Viagem</h3>
          <p className="text-xs text-brand-accent font-bold animate-pulse">● Tutor Inteligente</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => {
          const parts = msg.text.split('---');
          const isCurrentlyPlaying = isPlaying && activeMessageId === idx;
          
          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none text-lg' 
                  : 'bg-white text-brand-dark border border-slate-200 rounded-tl-none'
              }`}>
                <div className={msg.role === 'model' ? 'text-xl font-medium mb-1' : ''}>
                  {parts[0].trim().replace(/\*\*/g, '')}
                </div>
                
                {msg.role === 'model' && parts[1] && (
                  <div className="text-sm text-slate-500 border-t border-slate-100 pt-2 mt-2 italic bg-slate-50 p-2 rounded-lg leading-relaxed">
                    {parts[1].trim()}
                  </div>
                )}

                {msg.role === 'model' && (
                  <button 
                    onClick={() => handleSpeakToggle(msg.text, idx)}
                    className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      isCurrentlyPlaying 
                        ? 'bg-red-100 text-red-600 ring-2 ring-red-200' 
                        : 'bg-indigo-50 text-brand-primary hover:bg-indigo-100'
                    }`}
                  >
                    {isCurrentlyPlaying ? '⏹ Parar' : '🔊 Ouvir'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digitando...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-2">
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full w-fit mx-auto mb-2 animate-pulse border border-red-100">
             <div className="w-2 h-2 bg-red-600 rounded-full"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Ouvindo...</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder={isListening ? "Pode falar..." : "Sua resposta..."}
            className="flex-grow p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary transition-all text-lg"
          />
          
          <button
            onClick={toggleMic}
            className={`p-4 rounded-2xl transition-all shadow-lg ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-brand-accent text-brand-dark hover:bg-amber-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </button>

          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim()}
            className="p-4 bg-brand-primary text-white rounded-2xl shadow-lg hover:bg-brand-primaryHover disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
