import { useCart } from '../../hooks/useCart.tsx';
import { CartItem } from '../../components/shared/CartItem/CartItem.tsx';
import type { Book } from '../../types/BooksAPI.ts';
import './CartPage.scss';
import { useTranslation } from 'react-i18next';
import { useBooks } from '../../hooks/useBooks.ts';

function getPrice(book: Book) {
  return book.price_discount ?? book.price_regular;
}

export function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  const { t } = useTranslation();
  const { data: books = [], isLoading, error } = useBooks();

  const cartBooks = items
    .map((item) => ({
      book: books.find((book) => book.id === item.productId),
      quantity: item.quantity,
    }))
    .filter(
      (
        item,
      ): item is {
        book: Book;
        quantity: number;
      } => Boolean(item.book),
    );

  const total = cartBooks.reduce(
    (sum, line) => sum + getPrice(line.book) * line.quantity,
    0,
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Failed to load books</h2>;
  }

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">{t('cart.title')}</h1>

      {cartBooks.length === 0 ?
        <p className="cart-page__empty">{t('cart.empty')}</p>
      : <div className="cart-page__content">
          <div className="cart-page__list">
            {cartBooks.map(({ book, quantity }) => (
              <CartItem
                key={book.id}
                book={book}
                quantity={quantity}
                onIncrease={() => updateQuantity(book.id, quantity + 1)}
                onDecrease={() => updateQuantity(book.id, quantity - 1)}
                onRemove={() => removeFromCart(book.id)}
              />
            ))}
          </div>

          <aside className="cart-page__sidebar">
            <p className="cart-page__total-label">{t('cart.total')}</p>
            <p className="cart-page__total-value">₴{total.toFixed(2)}</p>
            <button
              type="button"
              className="cart-page__checkout-btn"
            >
              {t('cart.checkout')}
            </button>
          </aside>
        </div>
      }
    </section>
  );
}
