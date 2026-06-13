const CART_KEY = 'cart';

export const cartService = {
  getCart(): string[] {
    const data = localStorage.getItem(CART_KEY);

    return data ? JSON.parse(data) : [];
  },

  saveCart(cart: string[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },
};
