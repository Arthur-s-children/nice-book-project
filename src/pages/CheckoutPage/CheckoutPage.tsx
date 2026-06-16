import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../../hooks/useCart.tsx';
import { useBooks } from '../../hooks/useBooks.ts';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.ts';
import { getImageUrl } from '../../services/getImageUrl.ts';
import type { Book } from '../../types/BooksAPI.ts';
import { supabase } from '../../api/supabase';

import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import {
  useSupabaseDeliveryCities,
  useSupabaseDeliveryWarehouses,
} from '../../hooks/useSupabaseDelivery';
import './CheckoutPage.scss';

function getPrice(book: Book) {
  return book.price_discount ?? book.price_regular;
}

function validateCardNumber(num: string): boolean {
  const sanitized = num.replace(/\s+/g, '');
  if (!/^\d{16}$/.test(sanitized)) return false;

  let sum = 0;
  for (let i = 0; i < sanitized.length; i++) {
    let intVal = parseInt(sanitized[i], 10);
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) intVal -= 9;
    }
    sum += intVal;
  }
  return sum % 10 === 0;
}

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: books = [] } = useBooks();

  const { user, isAuthenticated } = useAuth();
  const currentUserId = user?.id || null;

  const { orders = [] } = useOrders(currentUserId || undefined);

  const isFirstPurchase = isAuthenticated && orders.length === 0;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [deliveryType, setDeliveryType] = useState<'warehouse' | 'postomat'>(
    'warehouse',
  );
  const [searchCity, setSearchCity] = useState('');
  const [selectedCityRef, setSelectedCityRef] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [modalStatus, setModalStatus] = useState<'success' | 'error' | null>(
    null,
  );

  const debouncedSearchCity = useDebouncedValue(searchCity.trim(), 300);

  const { data: cities = [], isFetching: isCitiesFetching } =
    useSupabaseDeliveryCities(debouncedSearchCity);
  const { data: warehouses = [], isFetching: isWarehousesFetching } =
    useSupabaseDeliveryWarehouses(selectedCityRef, deliveryType);

  const validateForm = (currentValues = {}): boolean => {
    const values = {
      firstName,
      lastName,
      phoneNumber,
      selectedCityRef,
      selectedWarehouse,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvc,
      ...currentValues,
    };

    const newErrors: Record<string, string> = {};

    if (!values.firstName.trim()) newErrors.firstName = 'Імʼя є обовʼязковим';
    else if (values.firstName.trim().length < 2)
      newErrors.firstName = 'Імʼя занадто коротке';

    if (!values.lastName.trim()) newErrors.lastName = 'Прізвище є обовʼязковим';
    else if (values.lastName.trim().length < 2)
      newErrors.lastName = 'Прізвище занадто коротке';

    const phoneDigits = values.phoneNumber.replace(/\D/g, '');
    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Номер телефону є обовʼязковим';
    } else if (!(phoneDigits.length === 10 || phoneDigits.length === 12)) {
      newErrors.phoneNumber =
        'Некоректний формат номера (має бути 10 або 12 цифр)';
    }

    if (!values.selectedCityRef)
      newErrors.searchCity = 'Оберіть місто зі списку';
    if (!values.selectedWarehouse)
      newErrors.selectedWarehouse = 'Оберіть відділення або поштомат';

    if (!values.cardNumber) newErrors.cardNumber = 'Вкажіть номер картки';
    else if (!validateCardNumber(values.cardNumber))
      newErrors.cardNumber = 'Недійсний номер картки';

    if (!values.cardName.trim()) newErrors.cardName = 'Вкажіть імʼя на картці';

    if (!values.cardExpiry || !/^\d{2}\/\d{2}$/.test(values.cardExpiry)) {
      newErrors.cardExpiry = 'Формат MM/YY';
    } else {
      const [month, year] = values.cardExpiry
        .split('/')
        .map((num) => parseInt(num, 10));
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = parseInt(
        now.getFullYear().toString().substring(2, 4),
        10,
      );

      if (month < 1 || month > 12) {
        newErrors.cardExpiry = 'Місяць 01-12';
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.cardExpiry = 'Картка протермінована';
      }
    }

    if (!values.cardCvc) newErrors.cardCvc = 'Обовʼязково';
    else if (!/^\d{3}$/.test(values.cardCvc)) newErrors.cardCvc = '3 цифри';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    validateForm({ [field]: value });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const cartBooks = items
    .map((item) => ({
      book: books.find((b) => b.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((item): item is { book: Book; quantity: number } =>
      Boolean(item.book),
    );

  const baseTotal = cartBooks.reduce(
    (sum, line) => sum + getPrice(line.book) * line.quantity,
    0,
  );
  const discountAmount = isFirstPurchase ? baseTotal * 0.1 : 0;
  const finalTotal = baseTotal - discountAmount;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: currentUserId,
            total_price: baseTotal,
            status: 'paid',
            shipping_address: selectedWarehouse,
            phone: phoneNumber.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            delivery_type: deliveryType,
            city_ref: selectedCityRef,
            warehouse_ref: selectedWarehouse,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsData = cartBooks.map(({ book, quantity }) => ({
        order_id: order.id,
        book_id: String(book.id),
        book_name: book.name,
        book_author: book.author || '',
        book_image: book.images?.[0] || '',
        book_slug: book.slug,
        quantity: quantity,
        price: getPrice(book),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
      }

      return order;
    },
    onSuccess: () => {
      clearCart();
      setModalStatus('success');

      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['orders', currentUserId] });
      }
    },
    onError: (err) => {
      console.error('Помилка оформлення:', err);
      setModalStatus('error');
    },
  });

  const handleCheckout = () => {
    setTouched({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      searchCity: true,
      selectedWarehouse: true,
      cardNumber: true,
      cardName: true,
      cardExpiry: true,
      cardCvc: true,
    });

    const isValid = validateForm();
    if (!isValid) {
      alert('Будь ласка, виправте помилки у формі оформлення.');
      return;
    }

    checkoutMutation.mutate();
  };

  const handleModalClose = () => {
    setModalStatus(null);
    if (modalStatus === 'success') {
      if (isAuthenticated) {
        navigate('/orders');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <section className="checkout-page">
      <h1 className="checkout-page__title">Оформлення замовлення</h1>

      <form
        className="checkout-page__content"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="checkout-page__form-section">
          <div className="checkout-page__section">
            <h3 className="checkout-page__section-title">1. Дані одержувача</h3>
            <div className="checkout-page__field-group">
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Ім'я"
                  value={firstName}
                  onBlur={() => handleBlur('firstName')}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    handleInputChange('firstName', e.target.value);
                  }}
                  className={`checkout-page__input ${touched.firstName && errors.firstName ? 'checkout-page__input--error' : ''}`}
                />
                {touched.firstName && errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Прізвище"
                  value={lastName}
                  onBlur={() => handleBlur('lastName')}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    handleInputChange('lastName', e.target.value);
                  }}
                  className={`checkout-page__input ${touched.lastName && errors.lastName ? 'checkout-page__input--error' : ''}`}
                />
                {touched.lastName && errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <input
                type="tel"
                placeholder="Номер телефону"
                value={phoneNumber}
                onBlur={() => handleBlur('phoneNumber')}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  handleInputChange('phoneNumber', e.target.value);
                }}
                className={`checkout-page__input checkout-page__input--full ${touched.phoneNumber && errors.phoneNumber ? 'checkout-page__input--error' : ''}`}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <span className="error-message">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="checkout-page__section">
            <h3 className="checkout-page__section-title">
              2. Доставка Новою Поштою
            </h3>
            <div className="checkout-page__delivery-types">
              <button
                type="button"
                className={`checkout-page__delivery-type ${deliveryType === 'warehouse' ? 'checkout-page__delivery-type--active' : ''}`}
                onClick={() => {
                  setDeliveryType('warehouse');
                  setSelectedWarehouse('');
                  handleInputChange('selectedWarehouse', '');
                }}
              >
                Відділення
              </button>
              <button
                type="button"
                className={`checkout-page__delivery-type ${deliveryType === 'postomat' ? 'checkout-page__delivery-type--active' : ''}`}
                onClick={() => {
                  setDeliveryType('postomat');
                  setSelectedWarehouse('');
                  handleInputChange('selectedWarehouse', '');
                }}
              >
                Поштомат
              </button>
            </div>

            <div style={{ position: 'relative', marginTop: '12px' }}>
              <input
                type="text"
                placeholder="Почніть вводити місто..."
                value={searchCity}
                onBlur={() => handleBlur('searchCity')}
                onChange={(e) => {
                  setSearchCity(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className={`checkout-page__input checkout-page__input--full ${touched.searchCity && errors.searchCity ? 'checkout-page__input--error' : ''}`}
              />
              {isCitiesFetching && (
                <span className="checkout-page__loader">Пошук міст...</span>
              )}
              {touched.searchCity && errors.searchCity && (
                <span className="error-message">{errors.searchCity}</span>
              )}

              {isDropdownOpen && cities.length > 0 && (
                <ul className="checkout-page__dropdown">
                  {cities.map((city) => (
                    <li
                      key={city.ref}
                      onClick={() => {
                        setSearchCity(city.name);
                        setSelectedCityRef(city.ref);
                        setIsDropdownOpen(false);
                        setSelectedWarehouse('');
                        validateForm({
                          searchCity: city.name,
                          selectedCityRef: city.ref,
                          selectedWarehouse: '',
                        });
                      }}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedCityRef && (
              <div style={{ marginTop: '12px' }}>
                <select
                  value={selectedWarehouse}
                  onBlur={() => handleBlur('selectedWarehouse')}
                  onChange={(e) => {
                    setSelectedWarehouse(e.target.value);
                    handleInputChange('selectedWarehouse', e.target.value);
                  }}
                  className={`checkout-page__select ${touched.selectedWarehouse && errors.selectedWarehouse ? 'checkout-page__input--error' : ''}`}
                  disabled={isWarehousesFetching}
                  style={{ width: '100%' }}
                >
                  <option value="">
                    {isWarehousesFetching ?
                      'Завантаження адрес...'
                    : 'Оберіть пункт видачі'}
                  </option>
                  {warehouses.map((w) => (
                    <option
                      key={w.ref}
                      value={w.name}
                    >
                      {w.name}
                    </option>
                  ))}
                </select>
                {touched.selectedWarehouse && errors.selectedWarehouse && (
                  <span className="error-message">
                    {errors.selectedWarehouse}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="checkout-page__section">
            <h3 className="checkout-page__section-title">3. Оплата карткою</h3>
            <div>
              <input
                type="text"
                placeholder="Номер картки (16 цифр)"
                maxLength={19}
                value={cardNumber}
                onBlur={() => handleBlur('cardNumber')}
                onChange={(e) => {
                  const v = e.target.value
                    .replace(/\s+/g, '')
                    .replace(/[^0-9]/gi, '');
                  const matches = v.match(/\d{4,16}/g);
                  const match = (matches && matches[0]) || '';
                  const parts = [];
                  for (let i = 0, len = match.length; i < len; i += 4) {
                    parts.push(match.substring(i, i + 4));
                  }
                  const formatted = parts.length > 0 ? parts.join(' ') : v;
                  setCardNumber(formatted);
                  handleInputChange('cardNumber', formatted);
                }}
                className={`checkout-page__input checkout-page__input--full ${touched.cardNumber && errors.cardNumber ? 'checkout-page__input--error' : ''}`}
              />
              {touched.cardNumber && errors.cardNumber && (
                <span className="error-message">{errors.cardNumber}</span>
              )}
            </div>

            <div style={{ marginTop: '12px' }}>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onBlur={() => handleBlur('cardName')}
                onChange={(e) => {
                  const v = e.target.value.toUpperCase();
                  setCardName(v);
                  handleInputChange('cardName', v);
                }}
                className={`checkout-page__input checkout-page__input--full ${touched.cardName && errors.cardName ? 'checkout-page__input--error' : ''}`}
              />
              {touched.cardName && errors.cardName && (
                <span className="error-message">{errors.cardName}</span>
              )}
            </div>

            <div
              className="checkout-page__field-group"
              style={{ marginTop: '12px' }}
            >
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="ММ/РР"
                  maxLength={5}
                  value={cardExpiry}
                  onBlur={() => handleBlur('cardExpiry')}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/gi, '');
                    const formatted =
                      v.length >= 2 ?
                        `${v.substring(0, 2)}/${v.substring(2, 4)}`
                      : v;
                    setCardExpiry(formatted);
                    handleInputChange('cardExpiry', formatted);
                  }}
                  className={`checkout-page__input ${touched.cardExpiry && errors.cardExpiry ? 'checkout-page__input--error' : ''}`}
                />
                {touched.cardExpiry && errors.cardExpiry && (
                  <span className="error-message">{errors.cardExpiry}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="password"
                  placeholder="CVC"
                  maxLength={3}
                  value={cardCvc}
                  onBlur={() => handleBlur('cardCvc')}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/gi, '');
                    setCardCvc(v);
                    handleInputChange('cardCvc', v);
                  }}
                  className={`checkout-page__input ${touched.cardCvc && errors.cardCvc ? 'checkout-page__input--error' : ''}`}
                />
                {touched.cardCvc && errors.cardCvc && (
                  <span className="error-message">{errors.cardCvc}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="checkout-page__sidebar">
          <h3 className="checkout-page__section-title">Ваше замовлення</h3>

          {isFirstPurchase && (
            <div
              className="first-purchase-badge"
              style={{
                backgroundColor: '#e8f8f0',
                color: '#2ecc71',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px dashed #2ecc71',
                textAlign: 'center',
                marginBottom: '15px',
              }}
            >
              🎉 Знижка 10% на першу покупку буде застосована автоматично!
            </div>
          )}

          <div className="checkout-page__mini-cart">
            {cartBooks.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="checkout-mini-item"
              >
                <img
                  src={getImageUrl(book.images?.[0] || '')}
                  alt={book.name}
                  className="checkout-mini-item__img"
                />
                <div className="checkout-mini-item__info">
                  <p className="checkout-mini-item__title">{book.name}</p>
                  <p className="checkout-mini-item__price">
                    {quantity} x ₴{getPrice(book).toFixed(2)}
                  </p>
                  <div className="checkout-mini-counter">
                    <button
                      type="button"
                      className="checkout-mini-counter__btn"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                    >
                      -
                    </button>
                    <span className="checkout-mini-counter__value">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="checkout-mini-counter__btn"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="checkout-mini-item__delete-btn"
                    onClick={() => removeFromCart(book.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: '1px solid #eee',
              paddingTop: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#666',
              }}
            >
              <span>Сума:</span>
              <span>₴{baseTotal.toFixed(2)}</span>
            </div>
            {isFirstPurchase && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#2ecc71',
                  fontWeight: '500',
                }}
              >
                <span>Очікувана знижка:</span>
                <span>- ₴{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div
              className="checkout-page__summary-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '18px',
                marginTop: '8px',
              }}
            >
              <span>{t('cart.total')}</span>
              <span>₴{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            className="checkout-page__submit-btn"
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending || cartBooks.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '10px',
            }}
          >
            {checkoutMutation.isPending ?
              'Обробка платежу...'
            : `Оплатити ₴${finalTotal.toFixed(2)}`}
          </button>
        </aside>
      </form>

      {modalStatus && (
        <div className="checkout-modal-overlay">
          <div
            className={`checkout-modal ${modalStatus === 'error' ? 'checkout-modal--error' : ''}`}
          >
            <h3>
              {modalStatus === 'success' ? 'Дякуємо за замовлення!' : 'Помилка'}
            </h3>
            <p>
              {modalStatus === 'success' ?
                'Оплата пройшла успішно. Наш менеджер вже звʼязується з вами для підтвердження.'
              : 'Сталася помилка при проведенні транзакції. Будь ласка, перевірте дані картки.'
              }
            </p>
            <button
              type="button"
              onClick={handleModalClose}
              className="checkout-modal__btn"
            >
              {modalStatus === 'success' ?
                isAuthenticated ?
                  'До історії замовлень'
                : 'На головну'
              : 'Спробувати знову'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
