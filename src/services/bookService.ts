import audiobooks from './audiobook.json';
import kindles from './kindle.json';
import paperbacks from './paperback.json';
import type { Book } from '../types/Book';

const allBooks: Book[] = [
  ...(audiobooks as Book[]),
  ...(kindles as Book[]),
  ...(paperbacks as Book[]),
];

export const bookService = {
  getAll: () => allBooks,

  getById: (id: string) => allBooks.find((book) => book.id === id) ?? null,

  getByType: (type: 'audiobook' | 'kindle' | 'paperback') =>
    allBooks.filter((book) => book.type === type),

  search: (query: string) =>
    allBooks.filter(
      (book) =>
        book.name.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()),
    ),

  getByCategory: (category: string) =>
    allBooks.filter((book) => book.category.includes(category)),
};
