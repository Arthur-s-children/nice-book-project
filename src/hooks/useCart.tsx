import { useState } from 'react';
import { cartService, type CartItem } from '../services/cartService';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => cartService.getAll());

  const cartIds = items.map((item) => item.productId);

  const addToCart = (id: string) => {
    cartService.add(id);
    setItems(cartService.getAll());
  };

  const removeFromCart = (id: string) => {
    cartService.remove(id);
    setItems(cartService.getAll());
  };

  const updateQuantity = (id: string, quantity: number) => {
    cartService.updateQuantity(id, quantity);
    setItems(cartService.getAll());
  };

  return { items, cartIds, addToCart, removeFromCart, updateQuantity };
}
