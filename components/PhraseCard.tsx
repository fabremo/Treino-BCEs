import React, { useState, useMemo, useEffect } from 'react';
import { Phrase } from '../data/phrases';
import { useSpeech } from '../hooks/useSpeech';
import { useFavorites } from '../hooks/useFavorites';

interface PhraseCardProps {
  phrase: Phrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const { speak, isPlaying } = useSpeech();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Estado para saber QUAL botão disparou o áudio (main ou exemplo específico)
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);

  const isFav = isFavorite(phrase.id);

  // Reseta o identificador de áudio quando o som para
  useEffect(() => {
    if (!isPlaying) {
      setActiveAudioKey(null);
    }
  }, [isPlaying]);

  const examples = useMemo(() => {
    if (!phrase.slots || phrase.slots.length === 0) return [];
    
    const maxExamples = phrase.slots[0].examples.length;
    const limit = Math.min(maxExamples, 3);
    const results = [];

    for (let i = 0; i < limit; i++) {
        const replacements = new Map<string, string>();
        phrase.slots.forEach(slot => {
            replacements.set(slot.name, slot.examples[i] || slot.examples[0]);
        });

        const parts = phrase.englishText.split(/\{(\w+)\}/g);
        const text = parts.map(part => replacements.has(part) ? replacements.get(part) : part).join('');
        
        const node = (
            <span>
                {parts.map((part, idx) => {
                     if (replacements.has(part)) {
                         return <strong key={idx} className="font-extrabold text-brand-primary">{replacements.get(part)}</strong>;
                     }
                     return <span key={idx}>{part}</span>;
                })}
            </span>
        );
        
        results.push({ text, node });
    }
    return results;
  }, [phrase]);

  const handleSpeakChunk = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveAudioKey('main');
    speak(phrase.englishText);
  };

  const handleSpeakExample = (e: React.MouseEvent, text: string, idx: number) => {
    e.stopPropagation();
    setActiveAudioKey(`example-${idx}`);
    speak(text);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-transparent perspective-1000 h-[480px] w-full">
      <div 
        className="relative w-full h-full transition-transform duration-700 preserve-3d"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRENTE */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white p-8 rounded-[2rem] shadow-card border border-slate-100 flex flex-col justify-between overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="flex justify-end items-start">
             <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(phrase.id); }}
                className={`text-2xl transition-all p-2 rounded-full ${isFav ? 'text-brand-accent bg-amber-50' : 'text-slate-300 hover:text-brand-accent hover:bg-slate-50'}`}
              >
                {isFav ? '★' : '☆'}
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4 px-2">
             <p className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-snug tracking-tight">
              {phrase.englishText}
            </p>
            <p className="text-brand-muted font-medium text-sm border-t border-slate-100 pt-3 mt-2 w-1/2">
              Estrutura (BCE)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
                onClick={handleSpeakChunk}
                className={`
                  font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2
                  ${isPlaying && activeAudioKey === 'main' 
                    ? 'bg-amber-400 text-brand-dark ring-4 ring-amber-200 animate-pulse' 
                    : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-indigo-200'}
                `}
              >
                <span>{isPlaying && activeAudioKey === 'main' ? '🔊' : '🔈'}</span> 
                {isPlaying && activeAudioKey === 'main' ? 'Ouvindo...' : 'Ouvir'}
            </button>
            <button
              onClick={handleFlip}
              className="bg-white hover:bg-slate-50 text-brand-dark font-bold py-4 rounded-xl text-lg border border-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>👁️</span> Tradução
            </button>
          </div>
        </div>

        {/* VERSO */}
        <div 
          className="absolute w-full h-full backface-hidden bg-slate-50 p-8 rounded-[2rem] shadow-card border border-slate-200 flex flex-col justify-between"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
        >
           <div className="flex justify-end items-start">
             <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(phrase.id); }}
                className={`text-2xl transition-all ${isFav ? 'text-brand-accent' : 'text-slate-300'}`}
              >
                {isFav ? '★' : '☆'}
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-start items-center text-center w-full pt-2">
             <p className="text-2xl sm:text-3xl font-bold text-emerald-900 leading-snug mb-6">
              {phrase.portugueseText}
            </p>
            
            {examples.length > 0 && (
              <div className="w-full space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block text-left pl-1">
                  Exemplos (Toque para ouvir):
                </span>
                {examples.map((ex, idx) => {
                  const isActive = isPlaying && activeAudioKey === `example-${idx}`;
                  return (
                    <button
                        key={idx}
                        onClick={(e) => handleSpeakExample(e, ex.text, idx)}
                        className={`
                          w-full p-3 rounded-xl border shadow-sm flex items-center gap-3 transition-all text-left group
                          ${isActive 
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' 
                            : 'bg-white border-slate-200 hover:border-brand-primary hover:bg-indigo-50'}
                        `}
                    >
                        <span className={`p-2 rounded-full text-base ${isActive ? 'bg-amber-400 text-white animate-pulse' : 'bg-indigo-50 text-brand-primary group-hover:bg-white'}`}>
                          {isActive ? '🔊' : '🔈'}
                        </span>
                        <span className={`text-base font-medium italic leading-snug ${isActive ? 'text-brand-dark' : 'text-slate-700'}`}>
                            "{ex.node}"
                        </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleFlip}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>↩️</span> Voltar para Inglês
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhraseCard;