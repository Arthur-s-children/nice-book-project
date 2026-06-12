import { SearchResultCardSkeleton } from '../SearchResultCard/SearchResultCardSkeleton';

export function SearchModalSkeleton() {
  return (
    <div className="search-modal__results-list">
      {Array.from({ length: 8 }).map((_, index) => (
        <SearchResultCardSkeleton key={`search-sk-${index}`} />
      ))}
    </div>
  );
}
