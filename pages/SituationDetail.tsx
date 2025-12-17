import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { situations, phrases } from '../data/phrases';
import PhraseCard from '../components/PhraseCard';

const SituationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

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

      {/* Busca */}
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