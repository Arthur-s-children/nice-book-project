import { Skeleton } from '../../shared/Skeleton/Skeleton';
import './CategoriesSection.scss'; // Твій файл стилів

export function CategoriesSectionSkeleton() {
  return (
    // Клас .categories автоматично додасть flex-direction: column та gap: 24px
    <section className="categories">
      {/* 1. Імітуємо заголовок "Shop by category" */}
      {/* Даємо йому висоту 32px (h-8), а ширину робимо фіксованою (w-64), щоб нагадував текст */}
      <div className="categories__title">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* 2. Сітка категорій. На десктопі вона сама зробить 3 колонки, а на мобільних — 1 */}
      <div className="categories__grid">
        {Array.from({ length: 3 }).map((_, index) => (
          // Кожна картка-заглушка імітує структуру .category-card
          <div
            key={`category-skeleton-${index}`}
            className="category-card"
          >
            {/* Блок для медіа (відео). 
                Клас .category-card__media автоматично задасть правильний aspect-ratio 
                (1.4/1 на десктопі, 1.25/1 на планшеті та 1.5/1 на мобільних) та скруглення кутів 8px!
                Тому скелетону всередині залишається просто розтягнутися на w-full h-full. */}
            <div className="category-card__media">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Текстовий блок під медіа */}
            {/* Назва категорії: висота 20px (h-5), ширина на 60% картки */}
            <div className="category-card__title">
              <Skeleton className="h-5 w-[60%]" />
            </div>

            {/* Кількість книг: висота 16px (h-4), маленька ширина */}
            <div className="category-card__amount">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
