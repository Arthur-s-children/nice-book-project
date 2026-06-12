// 1. Імпортуємо наш загальний скелетон
import { Skeleton } from '../Skeleton/Skeleton';
import './BookCard.scss';

export function BookCardSkeleton() {
  return (
    <article className="book-card">
      <div className="book-card__image-wrap">
        <Skeleton className="aspect-[3/4] h-54 rounded-md" />
      </div>

      <div className="book-card__body">
        <Skeleton className="h-4 w-1/3" />

        <Skeleton className="h-5 w-11/12 mt-1" />

        <div className="book-card__prices">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="book-card__stock">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="book-card__actions">
        <Skeleton className="h-10 w-47 rounded-md" />

        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </article>
  );
}
