import type { SortOption, PerPage } from '../../../hooks/useCatalogParams.tsx';
import { Dropdown } from '../Dropdown';
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
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Newest';

  return (
    <div className="catalog-controls">
      <div className="catalog-controls__select-wrap">
        <label
          className="catalog-controls__label"
          htmlFor="catalog-sort"
        >
          Sort by:
        </label>
        <Dropdown
          value={sortLabel}
          onChange={(value) => {
            const option = SORT_OPTIONS.find((o) => o.label === value);
            if (option) onParamChange('sort', option.value);
          }}
          options={SORT_OPTIONS.map((o) => o.label)}
          placeholder="Newest"
        />
      </div>

      <div className="catalog-controls__select-wrap">
        <label
          className="catalog-controls__label"
          htmlFor="catalog-per-page"
        >
          Items on page:
        </label>
        <Dropdown
          value={String(perPage)}
          onChange={(value) => onParamChange('perPage', value)}
          options={PER_PAGE_OPTIONS.map((n) => String(n))}
          placeholder="8"
        />
      </div>
    </div>
  );
}
