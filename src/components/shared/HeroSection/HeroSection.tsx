import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { heroSlides } from './HeroSlides';
import { Icon } from '../../ui/Icon';

import './HeroSection.scss';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';

interface HeroSectionProps {
  isLoading: boolean;
}

export const HeroSection = ({ isLoading }: HeroSectionProps) => {
  return isLoading ?
      <HeroSectionSkeleton />
    : <section className="hero">
        <button
          className="hero__button hero__button--prev"
          type="button"
        >
          <Icon name="arrow-left" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: '.hero__button--prev',
            nextEl: '.hero__button--next',
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          className="hero__swiper"
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

        <button
          className="hero__button hero__button--next"
          type="button"
        >
          <Icon name="arrow-right" />
        </button>
      </section>;
};
