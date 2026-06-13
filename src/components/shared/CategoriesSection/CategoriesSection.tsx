import { categories } from './categories';
import { CategoryCard } from './CategoryCard';
import './CategoriesSection.scss';
import { useBooks } from '../../../hooks/useBooks.ts';
import { useTimeCounter } from '../../../hooks/useTimeCounter.ts';
import { useInView } from 'react-intersection-observer';
import { CategoriesSectionSkeleton } from './CategoriesSectionSkeleton.tsx';

interface CategoriesSectionProps {
  isLoading: boolean;
}

export const CategoriesSection = ({ isLoading }: CategoriesSectionProps) => {
  const { data = [] } = useBooks();
  const counts = data.reduce(
    (acc, book) => {
      acc[book.type]++;

      return acc;
    },
    {
      audiobook: 0,
      kindle: 0,
      paperback: 0,
    },
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.8,
  });

  const audiobooksCount = useTimeCounter(counts.audiobook * 33, 3, inView);

  const kindlesCount = useTimeCounter(counts.kindle * 39, 4, inView);

  const paperbacksCount = useTimeCounter(counts.paperback * 29, 6, inView);

  return isLoading ?
      <CategoriesSectionSkeleton />
    : <section
        className="categories"
        ref={ref}
      >
        <h2 className="categories__title">Shop by category</h2>

        <div className="categories__grid">
          <CategoryCard
            {...categories[0]}
            amount={audiobooksCount}
          />

          <CategoryCard
            {...categories[1]}
            amount={kindlesCount}
          />

          <CategoryCard
            {...categories[2]}
            amount={paperbacksCount}
          />
        </div>
      </section>;
};
