import { useCatalogParams } from '../../hooks/useCatalogParams.tsx';
import { useCart } from '../../hooks/useCart.tsx';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import { BookCard } from '../../components/shared/BookCard/BookCard.tsx';
import { CatalogControls } from '../../components/ui/CatalogControls/CatalogControls.tsx';
import { Pagination } from '../../components/ui/Pagination/Pagination.tsx';
import type { Book } from '../../types/BooksAPI.ts';
import './CatalogPage.scss';
import { useBooks } from '../../hooks/useBooks.ts';
import { BookCardSkeleton } from '../../components/shared/BookCard/BookCardSkeleton.tsx';

const TITLES: Record<string, string> = {
  all: 'All books',
  paperback: 'Paper books',
  kindle: 'Kindle books',
  audiobook: 'Audiobooks',
};

function getPrice(book: Book) {
  return book.price_discount ?? book.price_regular;
}

function sortBooks(books: Book[], sort: string) {
  const list = [...books];

  if (sort === 'price-asc') {
    list.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sort === 'price-desc') {
    list.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sort === 'oldest') {
    list.sort((a, b) => a.publication_year - b.publication_year);
  } else {
    list.sort((a, b) => b.publication_year - a.publication_year);
  }

  return list;
}

export function CatalogPage() {
  const { sort, type, perPage, page, setParam } = useCatalogParams();
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const { data: books = [], isLoading, error } = useBooks();

  const filteredBooks =
    type === 'all' ? books : books.filter((book) => book.type === type);

  const sortedBooks = sortBooks(filteredBooks, sort);
  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const start = (page - 1) * perPage;
  const booksOnPage = sortedBooks.slice(start, start + perPage);

  if (error) {
    return <h2>Failed to load books</h2>;
  }

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

      {isLoading ?
        <div className="catalog-grid">
          {Array.from({ length: perPage }).map((_, index) => (
            <BookCardSkeleton key={`catalog-skeleton-${index}`} />
          ))}
        </div>
      : booksOnPage.length === 0 ?
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
