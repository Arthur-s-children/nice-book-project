import { AppButton } from '../../ui/Button';
import { LikeButton } from '../../ui/LikeButton';
import type { Book } from '../../../types/BooksAPI.ts';
import './BookCard.scss';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../services/getImageUrl.ts';
import { Headphones, Truck } from 'lucide-react';
import { useState } from 'react';

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
  const price = book.price_discount ?? book.price_regular;
  const imageSrc = getImageUrl(book.images[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="book-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="book-card__image-wrap">
        <Link to={`/products/${book.slug}`}>
          <img
            src={imageSrc}
            alt={book.name}
            className="book-card__image"
          />
        </Link>
        {book.type === 'audiobook' && (
          <span className="book-card__badge">
            <Headphones size={16} />
          </span>
        )}
      </div>

      <div className="book-card__body">
        <p className="book-card__author">{book.author}</p>
        <div className="book-card__name-container">
          <Link
            to={`/products/${book.slug}`}
            className="book-card__name"
          >
            {book.name}
          </Link>
        </div>
        <div className="book-card__prices">
          <span className="book-card__price">₴{price}</span>
          {book.price_discount && (
            <span className="book-card__old-price">₴{book.price_regular}</span>
          )}
        </div>
        <p className="book-card__stock">
          <Truck size={14} />
          In stock
        </p>
      </div>

      <div
        className={`book-card__actions ${isHovered ? 'book-card__actions--visible' : ''}`}
      >
        <AppButton
          variant={inCart ? 'selected' : 'primary'}
          onClick={() => !inCart && onAddToCart(book.id)}
        >
          {inCart ? 'Added' : 'Add to cart'}
        </AppButton>
        <LikeButton
          isSelected={isFavorite}
          onClick={() => onToggleFavorite(book.id)}
          colored
        />
      </div>
    </article>
  );
}
