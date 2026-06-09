import { useState } from 'react';
import { favoritesService } from '../services/favoritesService';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    favoritesService.getAll(),
  );

  const toggleFavorite = (id: string) => {
    favoritesService.toggle(id);
    setFavoriteIds(favoritesService.getAll());
  };

  return { favoriteIds, toggleFavorite };
}
