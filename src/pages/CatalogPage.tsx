import { bookService } from '../services/bookService';
import { useCatalogParams } from '../hooks/useCatalogParams';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { BookCard } from '../components/layout/BookCard';
import { CatalogControls } from '../components/layout/CatalogControls';
import { Pagination } from '../components/layout/Pagination';
import type { Book } from '../types/Book';
import './CatalogPage.scss';

const TITLES: Record<string, string> = {
  all: 'All books',
  paperback: 'Paper books',
  kindle: 'Kindle books',
  audiobook: 'Audiobooks',
};

function getPrice(book: Book) {
  return book.priceDiscount ?? book.priceRegular;
}

function sortBooks(books: Book[], sort: string) {
  const list = [...books];

  if (sort === 'price-asc') {
    list.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sort === 'price-desc') {
    list.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sort === 'oldest') {
    list.sort((a, b) => a.publicationYear - b.publicationYear);
  } else {
    list.sort((a, b) => b.publicationYear - a.publicationYear);
  }

  return list;
}

export function CatalogPage() {
  const { sort, type, perPage, page, setParam } = useCatalogParams();
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  let books = bookService.getAll();

  if (type !== 'all') {
    books = books.filter((book) => book.type === type);
  }

  const sortedBooks = sortBooks(books, sort);
  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const start = (page - 1) * perPage;
  const booksOnPage = sortedBooks.slice(start, start + perPage);

  return (
    <section className="catalog">
      <h1 className="catalog-title">{TITLES[type] ?? 'All books'}</h1>
      <p className="catalog-count">
        {sortedBooks.length.toLocaleString()} books
      </p>

      <CatalogControls
        sort={sort}
        perPage={perPage}
        onParamChange={setParam}
      />

      {booksOnPage.length === 0 ?
        <p className="catalog-empty">No books found.</p>
      : <div className="catalog-grid">
          {booksOnPage.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              inCart={cartIds.includes(book.id)}
              isFavorite={favoriteIds.includes(book.id)}
            />
          ))}
        </div>
      }

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setParam('page', String(newPage))}
        />
      )}
    </section>
  );
}
