import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 mt-8 animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-soft w-full text-center border border-slate-100">
        <div className="mb-6 inline-block p-4 bg-indigo-50 rounded-full">
            <span className="text-5xl">👋</span>
        </div>
        <h2 className="text-3xl font-extrabold text-brand-dark mb-4 tracking-tight">
          Bem-vindo!
        </h2>
        <p className="text-lg text-brand-muted leading-relaxed max-w-lg mx-auto">
          Sua ferramenta essencial para comunicação rápida e clara em viagens e no dia a dia.
        </p>
      </div>

      <button
        onClick={() => navigate('/cenarios')}
        className="w-full py-6 bg-brand-primary hover:bg-brand-primaryHover text-white text-xl font-bold rounded-2xl shadow-xl shadow-indigo-200 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
      >
        <span>COMEÇAR AGORA</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>

      <div className="grid grid-cols-3 gap-4 w-full text-center opacity-70">
        <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">👂</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Ouça</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">👁️</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Leia</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🗣️</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Fale</span>
        </div>
      </div>
    </div>
  );
};

export default Home;