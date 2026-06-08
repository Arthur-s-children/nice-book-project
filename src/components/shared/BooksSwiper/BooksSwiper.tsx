import { useRef } from 'react';
import { Icon } from '../../Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import './BooksSwiper.scss';

import 'swiper/css';

interface Book {
  id: number | string;
  title: string;
}

interface BooksSwiperProps {
  title: string;
  books: Book[];
}

export const BooksSwiper = ({ title, books }: BooksSwiperProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="books-swiper">
      <div className="books-swiper__header">
        <h2 className="books-swiper__title">{title}</h2>

        <div className="books-swiper__nav">
          <button
            ref={prevRef}
            className="books-swiper__arrow books-swiper__arrow--prev"
          >
            <Icon name="arrow-left" />
          </button>
          <button
            ref={nextRef}
            className="books-swiper__arrow books-swiper__arrow--next"
          >
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>

      <div className="books-swiper__slider-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
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
          className="books-swiper__container"
        >
          {books.map((book) => (
            <SwiperSlide
              key={book.id}
              className="books-swiper__slide"
            >
              <div className="books-swiper__card-placeholder">{book.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
