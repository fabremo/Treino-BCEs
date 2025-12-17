import { useState, useEffect, useCallback } from 'react';

export interface TTSSettings {
  voiceURI: string | null;
  rate: number;
}

const STORAGE_KEY = 'ttsSettings:v1';

const DEFAULT_SETTINGS: TTSSettings = {
  voiceURI: null,
  rate: 0.95,
};

export const useTTSSettings = () => {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Erro ao carregar configurações TTS", e);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<TTSSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { settings, updateSettings };
};