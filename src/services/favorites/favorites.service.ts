const FAVORITES_KEY = 'favorites';

export const favoritesService = {
  getFavorites(): string[] {
    const data = localStorage.getItem(FAVORITES_KEY);

    return data ? JSON.parse(data) : [];
  },

  saveFavorites(favorites: string[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },
};
