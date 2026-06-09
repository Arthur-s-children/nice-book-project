import type { SortOption, PerPage } from '../../../hooks/useCatalogParams.tsx';
import './CatalogControls.scss';

const PER_PAGE_OPTIONS: PerPage[] = [8, 16, 32];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

interface Props {
  sort: SortOption;
  perPage: PerPage;
  onParamChange: (key: string, value: string) => void;
}

export function CatalogControls({ sort, perPage, onParamChange }: Props) {
  return (
    <div className="catalog-controls">
      <div className="catalog-controls__select-wrap">
        <label
          className="catalog-controls__label"
          htmlFor="catalog-sort"
        >
          Sort by:
        </label>
        <select
          id="catalog-sort"
          className="catalog-controls__select"
          value={sort}
          onChange={(e) => onParamChange('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
            >
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="catalog-controls__select-wrap">
        <label
          className="catalog-controls__label"
          htmlFor="catalog-per-page"
        >
          Items on page:
        </label>
        <select
          id="catalog-per-page"
          className="catalog-controls__select"
          value={perPage}
          onChange={(e) => onParamChange('perPage', e.target.value)}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option
              key={n}
              value={n}
            >
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
