
import React, { useState, useEffect } from 'react';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useSpeech } from '../hooks/useSpeech';

// FIX: Removed local global declaration of 'aistudio' because it conflicts with the environment-provided 'AIStudio' type.
// We will use type casting at the call sites to ensure compatibility and avoid redeclaration errors.

const Settings: React.FC = () => {
  const { settings, updateSettings } = useTTSSettings();
  const { speak, isPlaying } = useSpeech();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      // FIX: Accessing 'aistudio' via type casting to bypass the global declaration conflict and use existing environment definition
      const win = window as any;
      if (win.aistudio) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // FIX: Accessing 'aistudio' via type casting to bypass the global declaration conflict
    const win = window as any;
    if (win.aistudio) {
      await win.aistudio.openSelectKey();
      // Assume success conforme diretriz para evitar race condition
      setHasKey(true);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleTest = () => {
    speak("Simple English for you.");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 border-l-8 border-brand-primary pl-4">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ajustes do App
        </h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 space-y-10">
        
        {/* Gerenciamento de Conta/API */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-800">Conexão Gemini Cloud</h3>
            <p className="text-sm text-slate-500">Para produção, conecte seu projeto do Google Cloud para gerenciar limites e faturamento.</p>
          </div>
          
          <div className={`p-6 rounded-2xl border-2 transition-all ${hasKey ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${hasKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                <span className={`font-bold uppercase tracking-wider text-xs ${hasKey ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasKey ? 'Conectado a um Projeto' : 'Chave não configurada'}
                </span>
              </div>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Docs de Faturamento ↗
              </a>
            </div>

            <button
              onClick={handleSelectKey}
              className={`w-full py-4 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                hasKey 
                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' 
                : 'bg-brand-accent text-brand-dark hover:bg-amber-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
              {hasKey ? 'Trocar Conta / Chave API' : 'Configurar Chave API'}
            </button>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Velocidade */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label htmlFor="rate-slider" className="text-xl font-bold text-slate-800">
              Velocidade da Voz
            </label>
            <span className="px-4 py-1 bg-indigo-50 text-brand-primary rounded-full font-bold">
              {settings.rate.toFixed(2)}x
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-slate-400 uppercase">Lento</span>
            <input
              id="rate-slider"
              type="range"
              min="0.7"
              max="1.1"
              step="0.05"
              value={settings.rate}
              onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
              className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <span className="text-sm font-bold text-slate-400 uppercase">Rápido</span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Seleção de Voz */}
        <div className="space-y-4">
          <label htmlFor="voice-select" className="block text-xl font-bold text-slate-800">
            Sotaque do Tutor
          </label>
          <select
            id="voice-select"
            value={settings.voiceURI || ''}
            onChange={(e) => updateSettings({ voiceURI: e.target.value })}
            className="w-full p-4 text-lg border-2 border-slate-100 rounded-2xl bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none transition-all"
          >
            <option value="">Padrão do Sistema</option>
            {availableVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTest}
          disabled={isPlaying}
          className={`
            w-full font-bold py-5 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3
            ${isPlaying 
              ? 'bg-brand-accent text-white ring-4 ring-amber-100' 
              : 'bg-indigo-50 text-brand-primary hover:bg-indigo-100 shadow-indigo-50'}
          `}
        >
          {isPlaying ? '🔊 Ouvindo...' : '🔈 Testar Voz'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
