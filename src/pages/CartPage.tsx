import { bookService } from '../services/bookService';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/layout/CartItem';
import type { Book } from '../types/Book';
import './CartPage.scss';

function getPrice(book: Book) {
  return book.priceDiscount ?? book.priceRegular;
}

export function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  const cartBooks: { book: Book; quantity: number }[] = [];

  for (const item of items) {
    const book = bookService.getById(item.productId);

    if (book) {
      cartBooks.push({ book, quantity: item.quantity });
    }
  }

  let total = 0;

  for (const line of cartBooks) {
    total += getPrice(line.book) * line.quantity;
  }

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">Cart</h1>

      {cartBooks.length === 0 ?
        <p className="cart-page__empty">Your cart is empty.</p>
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
            <p className="cart-page__total-label">Total</p>
            <p className="cart-page__total-value">₴{total.toFixed(2)}</p>
            <button
              type="button"
              className="cart-page__checkout-btn"
            >
              Checkout
            </button>
          </aside>
        </div>
      }
    </section>
  );
}
