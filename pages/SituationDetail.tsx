import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { situations, phrases } from '../data/phrases';
import PhraseCard from '../components/PhraseCard';
import { useSpeech } from '../hooks/useSpeech';

const TRAINING_SETTINGS_KEY = 'trainingSettings:v1';

const SituationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { speak, isPlaying } = useSpeech();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Training Mode State
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainIndex, setCurrentTrainIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Local state to track training audio source
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);

  // Derived Data
  const situation = situations.find((s) => s.slug === slug);

  const filteredPhrases = useMemo(() => {
    return phrases.filter((p) => {
      const belongsToSituation = p.situationSlug === slug;
      const matchesSearch = 
        p.englishText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.portugueseText.toLowerCase().includes(searchTerm.toLowerCase());
      return belongsToSituation && matchesSearch;
    });
  }, [slug, searchTerm]);

  const currentPhrase = (isTraining && filteredPhrases.length > 0) 
    ? filteredPhrases[currentTrainIndex] 
    : null;

  const trainingExamples = useMemo(() => {
        if (!currentPhrase || !currentPhrase.slots || currentPhrase.slots.length === 0) return [];
        
        const maxExamples = currentPhrase.slots[0].examples.length;
        const limit = Math.min(maxExamples, 3);
        const results = [];

        for (let i = 0; i < limit; i++) {
            const replacements = new Map<string, string>();
            currentPhrase.slots.forEach(slot => {
                replacements.set(slot.name, slot.examples[i] || slot.examples[0]);
            });

            const parts = currentPhrase.englishText.split(/\{(\w+)\}/g);
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
    }, [currentPhrase]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TRAINING_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAutoPlay(!!parsed.autoPlay);
      }
    } catch (e) {
      console.warn("Erro ao carregar configurações de treino", e);
    }
  }, []);

  // Reset audio key when speech stops
  useEffect(() => {
    if (!isPlaying) setActiveAudioKey(null);
  }, [isPlaying]);

  const toggleAutoPlay = () => {
    const newValue = !autoPlay;
    setAutoPlay(newValue);
    localStorage.setItem(TRAINING_SETTINGS_KEY, JSON.stringify({ autoPlay: newValue }));
  };
  
  useEffect(() => {
    setIsFlipped(false);
  }, [currentTrainIndex, isTraining]);

  const handleNavigation = (newIndex: number) => {
    setCurrentTrainIndex(newIndex);
    if (autoPlay && filteredPhrases[newIndex]) {
        const phrase = filteredPhrases[newIndex];
        setActiveAudioKey('auto-main');
        speak(phrase.englishText);
    }
  };

  const handleNext = () => handleNavigation(Math.min(filteredPhrases.length - 1, currentTrainIndex + 1));
  const handlePrev = () => handleNavigation(Math.max(0, currentTrainIndex - 1));
  const handleRandom = () => handleNavigation(Math.floor(Math.random() * filteredPhrases.length));

  if (!situation) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 mt-10 p-4">
        <h2 className="text-4xl font-bold text-slate-700 text-center">Cenário não encontrado</h2>
        <button
          onClick={() => navigate('/cenarios')}
          className="bg-brand-primary text-white px-8 py-4 rounded-2xl text-xl font-bold"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  // --- MODO TREINO ---
  if (isTraining && currentPhrase) {
    const isFirst = currentTrainIndex === 0;
    const isLast = currentTrainIndex === filteredPhrases.length - 1;

    return (
      <div className="flex flex-col min-h-[60vh] justify-between space-y-4">
        {/* Header Treino */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wide">
               Treino: <span className="text-brand-primary">{situation.title}</span>
            </h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold text-sm border border-slate-200">
              {currentTrainIndex + 1} / {filteredPhrases.length}
            </span>
          </div>

          <label className="flex items-center justify-between bg-white p-3 rounded-xl cursor-pointer border border-slate-200 shadow-sm hover:border-brand-primary transition-all">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-dark">Reprodução Automática</span>
                <span className="text-xs text-slate-500">Ouvir inglês ao avançar</span>
            </div>
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${autoPlay ? 'bg-brand-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${autoPlay ? 'translate-x-5' : 'translate-x-0'}`} />
                <input type="checkbox" className="hidden" checked={autoPlay} onChange={toggleAutoPlay} />
            </div>
          </label>
        </div>

        {/* CARTÃO GIGANTE DE TREINO */}
        <div className="flex-grow flex flex-col items-center justify-center my-2 perspective-1000 h-[480px]">
           <div 
             className="relative w-full h-full transition-transform duration-700 preserve-3d"
             style={{ 
               transformStyle: 'preserve-3d',
               transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
             }}
           >
             {/* FRENTE TREINO */}
             <div 
                className="absolute w-full h-full backface-hidden bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col justify-between items-center text-center"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
             >
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                    <p className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight tracking-tight">
                        {currentPhrase.englishText}
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3 mt-4">
                    <button
                        onClick={() => {
                            setActiveAudioKey('main');
                            speak(currentPhrase.englishText);
                        }}
                        className={`
                          w-full text-xl font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2
                          ${isPlaying && (activeAudioKey === 'main' || activeAudioKey === 'auto-main')
                             ? 'bg-amber-400 text-brand-dark ring-4 ring-amber-200 animate-pulse'
                             : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-indigo-200'}
                        `}
                    >
                         <span>{isPlaying && (activeAudioKey === 'main' || activeAudioKey === 'auto-main') ? '🔊' : '🔈'}</span> 
                         {isPlaying && (activeAudioKey === 'main' || activeAudioKey === 'auto-main') ? 'OUVINDO...' : 'OUVIR'}
                    </button>
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-brand-dark text-lg font-bold py-3 rounded-xl border border-slate-200 transition-colors"
                    >
                        VER RESPOSTA
                    </button>
                </div>
             </div>

             {/* VERSO TREINO */}
             <div 
                className="absolute w-full h-full backface-hidden bg-slate-50 p-6 rounded-[2rem] shadow-xl border border-slate-200 flex flex-col justify-between items-center text-center"
                style={{ 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                }}
             >
                <div className="w-full flex flex-col items-center justify-start pt-2">
                    <p className="text-2xl font-bold text-emerald-900 leading-tight mb-6">
                        {currentPhrase.portugueseText}
                    </p>

                    {trainingExamples.length > 0 && (
                        <div className="w-full space-y-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block text-left pl-1">
                                Toque para ouvir exemplos:
                            </span>
                            {trainingExamples.map((ex, idx) => {
                                const isActive = isPlaying && activeAudioKey === `example-${idx}`;
                                return (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAudioKey(`example-${idx}`);
                                            speak(ex.text);
                                        }}
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

                <div className="w-full flex flex-col gap-3 mt-4">
                    <button
                        onClick={() => setIsFlipped(false)}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-lg font-bold py-3 rounded-xl shadow-sm transition-all"
                    >
                        VOLTAR
                    </button>
                </div>
             </div>
           </div>
        </div>

        {/* Controles Navegação */}
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
                <button
                onClick={handlePrev}
                disabled={isFirst}
                className={`py-3 rounded-xl text-lg font-bold transition-all border ${
                    isFirst 
                    ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' 
                    : 'bg-white text-brand-dark border-slate-200 hover:border-brand-primary'
                }`}
                >
                ← Anterior
                </button>
                <button
                onClick={handleNext}
                disabled={isLast}
                className={`py-3 rounded-xl text-lg font-bold transition-all border ${
                    isLast 
                    ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' 
                    : 'bg-brand-dark text-white border-brand-dark hover:bg-slate-800'
                }`}
                >
                Próxima →
                </button>
            </div>
            
            <button
                onClick={handleRandom}
                className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 border border-purple-100"
            >
                <span>🎲</span> Sortear Aleatória
            </button>
        </div>

        <button
          onClick={() => setIsTraining(false)}
          className="w-full py-3 text-slate-400 font-bold text-base hover:text-red-500 transition-colors mt-0"
        >
          Encerrar Treino
        </button>
      </div>
    );
  }

  // --- MODO LISTA ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate('/cenarios')}
          className="text-base font-bold text-slate-500 hover:text-brand-dark flex items-center gap-2 self-start bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
        >
          ← Voltar
        </button>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center space-x-6">
            <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl">
              {situation.icon}
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              {situation.title}
              </h2>
              <p className="text-brand-muted font-medium mt-1">Lista de frases úteis</p>
            </div>
        </div>
      </div>

      {/* Busca e Ação */}
      <div className="flex flex-col gap-4 py-4 sm:sticky sm:top-[7.5rem] sm:z-30 sm:bg-brand-background/95 sm:backdrop-blur-sm sm:border-b sm:border-slate-200/50">
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Filtrar frases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-lg text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm"
          />
        </div>

        {filteredPhrases.length > 0 && (
          <button
            onClick={() => {
                setCurrentTrainIndex(0);
                setIsTraining(true);
            }}
            className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white text-xl font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.99] transition-transform flex items-center justify-center gap-3"
          >
            <span>🎓</span> INICIAR TREINO
          </button>
        )}
      </div>

      <div className="grid gap-8 pb-10">
        {filteredPhrases.length > 0 ? (
          filteredPhrases.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-soft">
            <p className="text-xl text-brand-muted font-medium">
              Nenhuma frase encontrada.
            </p>
             {searchTerm && (
                <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-brand-primary font-bold text-lg hover:underline"
                >
                Limpar filtro
                </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SituationDetail;