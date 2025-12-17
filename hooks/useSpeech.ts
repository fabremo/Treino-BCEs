import { useState, useEffect, useCallback, useRef } from 'react';

const SETTINGS_KEY = 'ttsSettings:v1';

export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Ref para evitar atualizações de estado em componentes desmontados
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        isMounted.current = false;
        // Cancela áudio ao desmontar para evitar vazamento de som
        window.speechSynthesis.cancel();
      };
    }
    return () => { isMounted.current = false; };
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Cancela anterior para evitar fila longa
    window.speechSynthesis.cancel();
    // Garante estado resetado antes de começar
    if (isMounted.current) setIsPlaying(false);

    let availableVoices = voices;
    if (availableVoices.length === 0) {
      availableVoices = window.speechSynthesis.getVoices();
    }

    let rate = 0.95;
    let savedVoiceURI = null;

    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.rate) rate = parsed.rate;
        if (parsed.voiceURI) savedVoiceURI = parsed.voiceURI;
      }
    } catch (e) {
      console.warn("Erro ao ler config TTS", e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (availableVoices.length > 0) {
      let selectedVoice = null;
      if (savedVoiceURI) {
        selectedVoice = availableVoices.find(v => v.voiceURI === savedVoiceURI);
      }
      if (!selectedVoice) {
        selectedVoice =
          availableVoices.find((v) => v.name.includes('Google US English')) ||
          availableVoices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
          availableVoices.find((v) => v.lang === 'en-US') ||
          availableVoices.find((v) => v.lang === 'en-GB') ||
          availableVoices.find((v) => v.lang.startsWith('en'));
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Event Listeners para controlar o estado visual
    utterance.onstart = () => {
      if (isMounted.current) setIsPlaying(true);
    };

    utterance.onend = () => {
      if (isMounted.current) setIsPlaying(false);
    };

    utterance.onerror = () => {
      if (isMounted.current) setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      if (isMounted.current) setIsPlaying(false);
    }
  }, [isSupported]);

  return { speak, cancel, isSupported, isPlaying };
};