import React, { useState, useEffect } from 'react';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useSpeech } from '../hooks/useSpeech';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useTTSSettings();
  const { speak, isPlaying } = useSpeech();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filtrar apenas vozes em inglês para simplificar
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
    speak("This is a test. Hello world.");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 border-l-8 border-slate-600 pl-4">
        Configurações de Voz
      </h2>

      <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-slate-200 space-y-8">
        
        {/* Velocidade */}
        <div className="space-y-4">
          <label htmlFor="rate-slider" className="block text-2xl font-bold text-slate-800">
            Velocidade da Fala: <span className="text-blue-700">{settings.rate.toFixed(2)}x</span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-500">Lento</span>
            <input
              id="rate-slider"
              type="range"
              min="0.7"
              max="1.1"
              step="0.05"
              value={settings.rate}
              onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
              className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-800"
            />
            <span className="text-xl font-bold text-slate-500">Rápido</span>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Seleção de Voz */}
        <div className="space-y-4">
          <label htmlFor="voice-select" className="block text-2xl font-bold text-slate-800">
            Escolher Voz:
          </label>
          {availableVoices.length > 0 ? (
            <select
              id="voice-select"
              value={settings.voiceURI || ''}
              onChange={(e) => updateSettings({ voiceURI: e.target.value })}
              className="w-full p-4 text-xl border-2 border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Automático (Recomendado)</option>
              {availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-lg text-red-600 font-bold bg-red-50 p-4 rounded-lg">
              Carregando vozes ou nenhuma voz em inglês encontrada...
            </p>
          )}
          <p className="text-slate-500 text-lg">
            Selecione uma voz com sotaque americano (US) ou britânico (GB) de sua preferência.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleTest}
            disabled={isPlaying}
            className={`
              w-full border-2 font-bold py-4 rounded-xl text-2xl transition-all active:scale-95 flex items-center justify-center gap-3
              ${isPlaying 
                ? 'bg-amber-400 border-amber-500 text-white ring-4 ring-amber-200' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300'}
            `}
          >
            <span>{isPlaying ? '🔊' : '🔊'}</span> 
            {isPlaying ? 'Testando...' : 'Testar Configuração'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;