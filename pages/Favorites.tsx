import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { phrases } from '../data/phrases';
import PhraseCard from '../components/PhraseCard';
import { useNavigate } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  // Filtra as frases que estão na lista de IDs favoritos
  const favoritePhrases = phrases.filter((phrase) => favorites.includes(phrase.id));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 border-l-8 border-yellow-400 pl-4">
        Meus Favoritos
      </h2>

      {favoritePhrases.length > 0 ? (
        <div className="grid gap-6">
          {favoritePhrases.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-yellow-50 p-8 rounded-xl border-2 border-yellow-200 text-center w-full">
            <span className="text-4xl block mb-4">⭐</span>
            <p className="text-xl text-slate-700 font-medium mb-2">
              Você ainda não tem frases favoritas salvas.
            </p>
            <p className="text-lg text-slate-500">
              Navegue pelos cenários e clique em "Salvar" nas frases que você mais usa.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/cenarios')}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Ver Cenários
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;