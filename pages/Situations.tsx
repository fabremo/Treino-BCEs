import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { situations } from '../data/phrases';

const Situations: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSituations = situations.filter((situation) =>
    situation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
            Cenários
            </h2>
            <span className="text-brand-muted font-medium">Selecione onde você está</span>
        </div>
        
        {/* Campo de Busca Profissional */}
        <div className="relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar cenário (ex: Restaurante)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-5 rounded-2xl bg-white border border-slate-200 text-lg text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {filteredSituations.length > 0 ? (
          filteredSituations.map((situation) => (
            <button
              key={situation.slug}
              onClick={() => navigate(`/cenarios/${situation.slug}`)}
              className="w-full bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:border-brand-primary/30 hover:shadow-card transition-all text-left flex items-center space-x-6 group active:scale-[0.99]"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-105 group-hover:bg-indigo-100 transition-all duration-300">
                {situation.icon}
              </div>
              <div className="flex-grow">
                <span className="text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                    {situation.title}
                </span>
                <p className="text-brand-muted text-sm mt-1 font-medium">Toque para ver frases</p>
              </div>
              <div className="text-slate-300 group-hover:text-brand-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-soft">
            <p className="text-xl text-brand-muted font-medium mb-4">
              Nenhum cenário encontrado para "<span className="text-brand-dark font-bold">{searchTerm}</span>".
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-brand-primary font-bold text-lg hover:underline decoration-2 underline-offset-4"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Situations;