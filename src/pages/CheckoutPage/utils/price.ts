import type { Book } from '../../../types/BooksAPI';

export const getPrice = (book: Book): number => {
  return book.price_discount ?? book.price_regular;
};
