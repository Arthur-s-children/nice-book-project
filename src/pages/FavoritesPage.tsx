import { bookService } from '../services/bookService';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { BookCard } from '../components/layout/BookCard';
import type { Book } from '../types/Book';
import './FavoritesPage.scss';

export function FavoritesPage() {
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteBooks: Book[] = [];

  for (const id of favoriteIds) {
    const book = bookService.getById(id);

    if (book) {
      favoriteBooks.push(book);
    }
  }

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
