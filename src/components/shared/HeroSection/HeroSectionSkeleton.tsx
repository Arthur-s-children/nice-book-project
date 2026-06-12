import { Skeleton } from '../../shared/Skeleton/Skeleton';
import './HeroSection.scss';

export function HeroSectionSkeleton() {
  return (
    <section className="hero">
      <button
        className="hero__button hero__button--prev"
        type="button"
        disabled
      >
        <Skeleton className="w-full h-full rounded-full bg-gray-300" />
      </button>

      <div className="hero__swiper">
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </div>

      <button
        className="hero__button hero__button--next"
        type="button"
        disabled
      >
        <Skeleton className="w-full h-full rounded-full bg-gray-300" />
      </button>
    </section>
  );
}
