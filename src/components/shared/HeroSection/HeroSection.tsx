import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { heroSlides } from './HeroSlides.ts';

import './HeroSection.scss';

export const HeroSection = () => {
  return (
    <section className="hero">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={slide.mobile}
              />

              <source
                media="(max-width: 1199px)"
                srcSet={slide.tablet}
              />

              <img
                src={slide.desktop}
                alt="Promotion banner"
                className="hero__image"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
