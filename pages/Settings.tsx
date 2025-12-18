
import React, { useState, useEffect } from 'react';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useSpeech } from '../hooks/useSpeech';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useTTSSettings();
  const { speak, isPlaying } = useSpeech();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const getMaskedApiKey = () => {
    const key = process.env.API_KEY || '';
    if (!key || key.includes('GEMINI_API_KEY') || key.length < 10) {
      return 'Chave de Teste Ativa';
    }
    // Mostra o padrão AIza... para chaves reais
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const isRealKey = () => {
    const key = process.env.API_KEY || '';
    return key.startsWith('AIza');
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

        <hr className="border-slate-100" />

        {/* Chave da API (Conferência) */}
        <div className={`p-6 rounded-2xl border ${isRealKey() ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
           <div className="flex items-center gap-2 mb-2">
             <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status da API Gemini</h4>
           </div>
           <div className="flex justify-between items-center">
             <code className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-brand-dark font-mono text-sm">
               {getMaskedApiKey()}
             </code>
             <span className={`text-xs font-bold uppercase tracking-tight flex items-center gap-1 ${isRealKey() ? 'text-emerald-600' : 'text-amber-500'}`}>
               <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
               {isRealKey() ? 'Chave Oficial' : 'Chave de Teste'}
             </span>
           </div>
           <p className="text-[10px] text-slate-400 mt-3 italic leading-tight">
             {isRealKey() 
               ? "Sua chave real está configurada corretamente." 
               : "O sistema está usando uma chave genérica de demonstração."}
           </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
