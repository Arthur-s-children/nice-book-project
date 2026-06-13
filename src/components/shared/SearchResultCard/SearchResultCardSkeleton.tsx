import { Skeleton } from '../../shared/Skeleton/Skeleton'; // підстав свій шлях

export function SearchResultCardSkeleton() {
  return (
    // Використовуємо твій оригінальний клас. Якщо у тебе в SCSS там стоїть display: flex,
    // то скелетон теж вирівняє картинку ліворуч, а текст праворуч!
    <div className="search-result-card pointer-events-none select-none">
      {/* 1. Заглушка під обкладинку книги */}
      {/* Клас .search-result-card__image підтягне твою ширину/висоту/border-radius з SCSS */}
      <div className="search-result-card__image overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* 2. Блок з інформацією */}
      <div className="search-result-card__info w-full">
        {/* Автор: робимо вузеньку плашку на 30% ширини */}
        <div className="search-result-card__author">
          <Skeleton className="h-4 w-[30%]" />
        </div>

        {/* Назва книги: робимо плашку вищою (h-5) і ширшою (на 75% контейнера) */}
        <h3 className="search-result-card__name">
          <Skeleton className="h-5 w-[75%] mt-1" />
        </h3>

        {/* Блок з ціною: імітуємо плашечку під цінник */}
        <div className="search-result-card__prices mt-2">
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}
