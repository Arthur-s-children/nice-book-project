import { useParams } from 'react-router-dom';
import { bookService } from '../../services';
import { NotFoundPage } from '../NotFoundPage';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { ItemCard } from '../../components/ItemCard';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const book = bookService.getAll().find((b) => b.slug === slug);

  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  if (!book) {
    return <NotFoundPage />;
  }

  const inCart = cartIds.includes(book.id);
  const isFavorite = favoriteIds.includes(book.id);

  return (
    <ItemCard
      book={book}
      inCart={inCart}
      isFavorite={isFavorite}
      addToCart={addToCart}
      toggleFavorite={toggleFavorite}
    />
  );
};
