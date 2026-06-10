import { Icon } from '../../ui/Icon';
import { AppButton } from '../../ui/Button';
import { LikeButton } from '../../ui/LikeButton';
import type { Book } from '../../../types/Book.ts';
import './BookCard.scss';

type Props = {
  book: Book;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  inCart: boolean;
  isFavorite: boolean;
};

export function BookCard({
  book,
  onAddToCart,
  onToggleFavorite,
  inCart,
  isFavorite,
}: Props) {
  const price = book.priceDiscount ?? book.priceRegular;
  const imageSrc = `${import.meta.env.BASE_URL}${book.images[0]}`;

  return (
    <article className="book-card">
      <div className="book-card__image-wrap">
        <img
          src={imageSrc}
          alt={book.name}
          className="book-card__image"
        />
        {book.type === 'audiobook' && (
          <span className="book-card__badge">
            <Icon name="headphones" />
          </span>
        )}
      </div>

      <div className="book-card__body">
        <p className="book-card__author">{book.author}</p>
        <h3 className="book-card__name">{book.name}</h3>
        <div className="book-card__prices">
          <span className="book-card__price">₴{price}</span>
          {book.priceDiscount && (
            <span className="book-card__old-price">₴{book.priceRegular}</span>
          )}
        </div>
        <p className="book-card__stock">
          <Icon name="truck" />
          In stock
        </p>
      </div>

      <div className="book-card__actions">
        <AppButton
          variant={inCart ? 'selected' : 'primary'}
          onClick={() => !inCart && onAddToCart(book.id)}
        >
          {inCart ? 'Added' : 'Add to cart'}
        </AppButton>
        <LikeButton
          isSelected={isFavorite}
          onClick={() => onToggleFavorite(book.id)}
        />
      </div>
    </article>
  );
}
