import { categories } from './categories';
import { CategoryCard } from './CategoryCard';
import { bookService } from '../../../services';
import './CategoriesSection.scss';

export const CategoriesSection = () => {
  const audiobooksCount = bookService.getByType('audiobook').length * 33;
  const kindlesCount = bookService.getByType('kindle').length * 44;
  const paperbacksCount = bookService.getByType('paperback').length * 25;

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
