import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart.tsx';
import { CartItem } from '../../components/shared/CartItem/CartItem.tsx';
import type { Book } from '../../types/BooksAPI.ts';
import { useBooks } from '../../hooks/useBooks.ts';
import './CartPage.scss';

function getPrice(book: Book) {
  return book.price_discount ?? book.price_regular;
}

export function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { data: books = [], isLoading, error } = useBooks();

  const [deliveryType, setDeliveryType] = useState<'warehouse' | 'poshtomat'>(
    'warehouse',
  );
  const [searchCity, setSearchCity] = useState('');
  const [cities, setCities] = useState<Array<{ ref: string; name: string }>>(
    [],
  );
  const [selectedCityRef, setSelectedCityRef] = useState('');
  const [warehouses, setWarehouses] = useState<
    Array<{ ref: string; name: string }>
  >([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  useEffect(() => {
    if (searchCity.length < 2) {
      return;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/delivery/cities?search=${encodeURIComponent(searchCity)}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        setCities(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchCity]);

  useEffect(() => {
    if (!selectedCityRef) {
      return;
    }

    const controller = new AbortController();
    async function fetchWarehouses() {
      try {
        const response = await fetch(
          `/api/delivery/warehouses?cityRef=${selectedCityRef}&type=${deliveryType}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        setWarehouses(data);
        setSelectedWarehouse('');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    fetchWarehouses();
    return () => controller.abort();
  }, [selectedCityRef, deliveryType]);

  const cartBooks = items
    .map((item) => ({
      book: books.find((b) => b.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((item): item is { book: Book; quantity: number } =>
      Boolean(item.book),
    );

  const total = cartBooks.reduce(
    (sum, line) => sum + getPrice(line.book) * line.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!selectedWarehouse) {
      alert('Будь ласка, оберіть відділення або поштомат для доставки.');
      return;
    }

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          delivery: {
            type: deliveryType,
            cityRef: selectedCityRef,
            warehouse: selectedWarehouse,
          },
        }),
      });

      const { data, signature } = await response.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.liqpay.ua/api/3/checkout';

      const dataInput = document.createElement('input');
      dataInput.type = 'hidden';
      dataInput.name = 'data';
      dataInput.value = data;
      form.appendChild(dataInput);

      const sigInput = document.createElement('input');
      sigInput.type = 'hidden';
      sigInput.name = 'signature';
      sigInput.value = signature;
      form.appendChild(sigInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Failed to load books</h2>;

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
            <div className="cart-page__delivery">
              <p className="cart-page__section-title">Доставка Нова Пошта</p>

              <div className="cart-page__delivery-types">
                <label
                  className={`cart-page__delivery-type ${
                    deliveryType === 'warehouse' ?
                      'cart-page__delivery-type--active'
                    : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'warehouse'}
                    onChange={() => setDeliveryType('warehouse')}
                  />
                  <span className="cart-page__delivery-type-title">
                    Відділення
                  </span>
                </label>

                <label
                  className={`cart-page__delivery-type ${
                    deliveryType === 'poshtomat' ?
                      'cart-page__delivery-type--active'
                    : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'poshtomat'}
                    onChange={() => setDeliveryType('poshtomat')}
                  />
                  <span className="cart-page__delivery-type-title">
                    Поштомат
                  </span>
                </label>
              </div>

              <div className="cart-page__field">
                <input
                  type="text"
                  placeholder="Введіть місто, наприклад Київ"
                  value={searchCity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchCity(value);
                    setSelectedCityRef('');
                    setWarehouses([]);
                    if (value.length < 2) {
                      setCities([]);
                    }
                  }}
                  className="cart-page__input"
                />
                {cities.length > 0 && (
                  <ul className="cart-page__autocomplete">
                    {cities.map((city) => (
                      <li
                        key={city.ref}
                        onClick={() => {
                          setSearchCity(city.name);
                          setSelectedCityRef(city.ref);
                          setCities([]);
                        }}
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {selectedCityRef && (
                <div className="cart-page__field">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="cart-page__select"
                  >
                    <option value="">Оберіть адресу призначення</option>
                    {warehouses.map((w) => (
                      <option
                        key={w.ref}
                        value={w.name}
                      >
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="cart-page__summary">
              <p className="cart-page__total-label">Total</p>
              <p className="cart-page__total-value">₴{total.toFixed(2)}</p>
              <button
                type="button"
                className="cart-page__checkout-btn"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </aside>
        </div>
      }
    </section>
  );
}
