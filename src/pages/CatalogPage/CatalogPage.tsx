import { bookService } from '../../services';
import { useCatalogParams } from '../../hooks/useCatalogParams.tsx';
import { useCart } from '../../hooks/useCart.tsx';
import { useFavorites } from '../../hooks/useFavorites.tsx';
import { BookCard } from '../../components/shared/BookCard/BookCard.tsx';
import { CatalogControls } from '../../components/ui/CatalogControls/CatalogControls.tsx';
import { Pagination } from '../../components/ui/Pagination/Pagination.tsx';
import type { Book } from '../../types/Book.ts';
import './CatalogPage.scss';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  let books = bookService.getAll();

  if (type !== 'all') {
    books = books.filter((book) => book.type === type);
  }

  const sortedBooks = sortBooks(books, sort);
  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const start = (page - 1) * perPage;
  const booksOnPage = sortedBooks.slice(start, start + perPage);

  const TITLES: Record<string, string> = {
    all: t('catalog.title.all'),
    paperback: t('catalog.title.paperback'),
    kindle: t('catalog.title.kindle'),
    audiobook: t('catalog.title.audiobook'),
  };

  return (
    <section className="catalog">
      <h1 className="catalog-title">
        {TITLES[type] ?? t('catalog.title.all')}
      </h1>
      <p className="catalog-count">
        {t('catalog.count', { count: sortedBooks.length })}
      </p>

      <CatalogControls
        sort={sort}
        perPage={perPage}
        onParamChange={setParam}
      />

      {booksOnPage.length === 0 ?
        <p className="catalog-empty">{t('catalog.empty')}</p>
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
