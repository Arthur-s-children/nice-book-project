import { categories } from './categories';
import { CategoryCard } from './CategoryCard';
import './CategoriesSection.scss';

export const CategoriesSection = () => {
  return (
    <section className="categories">
      <h2 className="categories__title">Shop by category</h2>

      <div className="categories__grid">
        <CategoryCard
          {...categories[0]}
          amount={150}
        />

        <CategoryCard
          {...categories[1]}
          amount={50}
        />

        <CategoryCard
          {...categories[2]}
          amount={100}
        />
      </div>
    </section>
  );
};
