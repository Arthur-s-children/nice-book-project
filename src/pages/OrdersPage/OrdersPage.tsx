import { useAuthContext } from '../../contexts/AuthContext';
import './OrdersPage.scss';

export function OrdersPage() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <div className="orders-page">Please sign in to view your orders</div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page__container">
        <h1 className="orders-page__title">Order History</h1>
        <p className="orders-page__empty">No orders yet</p>
      </div>
    </div>
  );
}
