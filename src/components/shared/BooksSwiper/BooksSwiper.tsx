import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { BookCard } from '../BookCard/BookCard';
import { BookCardSkeleton } from '../BookCard/BookCardSkeleton.tsx';
import { Icon } from '../../ui/Icon';
import { useCart } from '../../../hooks/useCart';
import { useFavorites } from '../../../hooks/useFavorites';
import type { Book } from '../../../types/BooksAPI.ts';
import './BooksSwiper.scss';

import 'swiper/css';

interface BooksSwiperProps {
  title: string;
  books: Book[];
  isLoading: boolean;
}

export const BooksSwiper = ({
  title,
  books = [],
  isLoading,
}: BooksSwiperProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  return (
    <section className="books-swiper">
      <div className="books-swiper__header">
        <h2 className="books-swiper__title">{title}</h2>

        <div className="books-swiper__nav">
          <button
            ref={prevRef}
            className="books-swiper__arrow books-swiper__arrow--prev"
          >
            <Icon
              name="arrow-left-dark"
              size={12}
            />
          </button>
          <button
            ref={nextRef}
            className="books-swiper__arrow books-swiper__arrow--next"
          >
            <Icon
              name="arrow-right-dark"
              size={12}
            />
          </button>
        </div>
      </div>

      <div className="books-swiper__slider-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerGroup={1}
          navigation={true}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1120: { slidesPerView: 4 },
          }}
          className="books-swiper__container"
        >
          {isLoading ?
            Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide
                key={`skeleton-${index}`}
                className="books-swiper__slide"
              >
                <BookCardSkeleton />
              </SwiperSlide>
            ))
          : books.map((book) => (
              <SwiperSlide
                key={book.id}
                className="books-swiper__slide"
              >
                <BookCard
                  book={book}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  inCart={cartIds.includes(book.id)}
                  isFavorite={favoriteIds.includes(book.id)}
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </section>
  );
};
