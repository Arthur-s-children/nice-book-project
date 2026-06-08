import { bookService } from '../../services/bookService.ts';
import { useCart } from '../../hooks/useCart.tsx';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import { BookCard } from '../../components/shared/BookCard/BookCard.tsx';
import type { Book } from '../../types/Book.ts';
import './FavoritesPage.scss';

export function FavoritesPage() {
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteBooks = favoriteIds
    .map((id) => bookService.getById(id))
    .filter((book): book is Book => book !== null);

  return (
    <section className="page">
      <h1 className="favorites-title">Favourites</h1>
      <p className="favorites-count">{favoriteBooks.length} books</p>

      {favoriteBooks.length === 0 ?
        <p className="favorites-empty">No favourite books yet.</p>
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
