import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'favorites:v1';
const EVENT_KEY = 'favorites-updated';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carrega favoritos do localStorage
  const loadFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();

    // Escuta evento customizado para sincronizar abas/componentes
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener(EVENT_KEY, handleStorageChange);
    return () => {
      window.removeEventListener(EVENT_KEY, handleStorageChange);
    };
  }, [loadFavorites]);

  const toggleFavorite = useCallback((id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentFavorites: string[] = stored ? JSON.parse(stored) : [];
      
      let newFavorites;
      if (currentFavorites.includes(id)) {
        newFavorites = currentFavorites.filter((favId) => favId !== id);
      } else {
        newFavorites = [...currentFavorites, id];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      
      // Dispara evento para atualizar outros componentes usando este hook
      window.dispatchEvent(new Event(EVENT_KEY));
      
      // Atualiza estado local imediatamente
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};