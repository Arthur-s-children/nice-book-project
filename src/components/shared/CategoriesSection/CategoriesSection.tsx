import { categories } from './categories';
import { CategoryCard } from './CategoryCard';
import './CategoriesSection.scss';
import { useBooks } from '../../../hooks/useBooks.ts';
import { useTimeCounter } from '../../../hooks/useTimeCounter.ts';

export const CategoriesSection = () => {
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

  const audiobooksCount = useTimeCounter(counts.audiobook * 33, 5);

  const kindlesCount = useTimeCounter(counts.kindle * 29, 5);

  const paperbacksCount = useTimeCounter(counts.paperback * 39, 5);

  return (
    <section className="categories">
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
    </section>
  );
};
