import { useAuthContext } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import './OrderHistoryPage.scss';

export function OrderHistoryPage() {
  const { user } = useAuthContext();
  const { orders, isLoading } = useOrders(user?.id);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="order-history">
        Please sign in to view your order history
      </div>
    );
  }

  if (isLoading) {
    return <div className="order-history">Loading orders...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'processing':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleItemClick = (bookSlug: string) => {
    navigate(`/products/${bookSlug}`);
  };

  return (
    <div className="order-history">
      <div className="order-history__container">
        <h1 className="order-history__title">Order History</h1>

        {orders.length === 0 ?
          <div className="order-history__empty">
            <p className="order-history__empty-text">No orders yet</p>
            <p className="order-history__empty-subtext">
              Start shopping to see your orders here
            </p>
          </div>
        : <div className="order-history__list">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-history__card"
              >
                <div className="order-history__card-header">
                  <div className="order-history__order-id">
                    <span className="order-history__label">Order #</span>
                    <span className="order-history__value">
                      {order.id.slice(0, 8)}
                    </span>
                  </div>
                  <div
                    className="order-history__status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                </div>

                <div className="order-history__card-body">
                  <div className="order-history__info">
                    <span className="order-history__label">Date:</span>
                    <span className="order-history__value">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <div className="order-history__info">
                    <span className="order-history__label">Total:</span>
                    <span className="order-history__value order-history__value--price">
                      ${order.total_price.toFixed(2)}
                    </span>
                  </div>

                  {order.shipping_address && (
                    <div className="order-history__info">
                      <span className="order-history__label">
                        Shipping Address:
                      </span>
                      <span className="order-history__value">
                        {order.shipping_address}
                      </span>
                    </div>
                  )}

                  {order.phone && (
                    <div className="order-history__info">
                      <span className="order-history__label">Phone:</span>
                      <span className="order-history__value">
                        {order.phone}
                      </span>
                    </div>
                  )}

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="order-history__items">
                      <h3 className="order-history__items-title">Items</h3>
                      <div className="order-history__items-list">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="order-history__item"
                            onClick={() => handleItemClick(item.book_slug)}
                          >
                            {item.book_image && (
                              <img
                                src={item.book_image}
                                alt={item.book_name}
                                className="order-history__item-image"
                              />
                            )}
                            <div className="order-history__item-details">
                              <div className="order-history__item-name">
                                {item.book_name}
                              </div>
                              <div className="order-history__item-author">
                                {item.book_author}
                              </div>
                              <div className="order-history__item-meta">
                                <span>Qty: {item.quantity}</span>
                                <span className="order-history__item-price">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
