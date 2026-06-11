import { bookService } from '../../services/bookService.ts';
import { useCart } from '../../hooks/useCart.tsx';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import { BookCard } from '../../components/shared/BookCard/BookCard.tsx';
import type { Book } from '../../types/Book.ts';
import './FavoritesPage.scss';
import { useTranslation } from 'react-i18next';

export function FavoritesPage() {
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { t } = useTranslation();

  const favoriteBooks = favoriteIds
    .map((id) => bookService.getById(id))
    .filter((book): book is Book => book !== null);

  const count = favoriteBooks.length;

  return (
    <section className="page">
      <h1 className="favorites-title">{t('favorites.title')}</h1>
      <p className="favorites-count">
        {count} {t('favorites.books', { count })}
      </p>

      {favoriteBooks.length === 0 ?
        <p className="favorites-empty">{t('favorites.empty')}</p>
      : <div className="favorites-grid">
          {favoriteBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              inCart={cartIds.includes(book.id)}
              isFavorite
            />
          ))}
        </div>
      }
    </section>
  );
}
