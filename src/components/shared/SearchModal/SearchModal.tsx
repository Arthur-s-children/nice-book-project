import { useState, useEffect, useMemo } from 'react';
import { SearchResultCard } from '../SearchResultCard/SearchResultCard';
import { Icon } from '../../ui/Icon';
import './SearchModal.scss';
import { categoryStructure } from './searchCategories.ts';
import { useBooks } from '../../../hooks/useBooks.ts';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const RESULTS_PER_PAGE = 8;

export function SearchModal({ isOpen, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showSales, setShowSales] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { data: books = [], isLoading } = useBooks();

  const filteredBooks = useMemo(() => {
    let results = books;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      results = results.filter(
        (book) =>
          book.name.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query),
      );
    }

    if (showSales) {
      results = results.filter((book) => book.price_discount !== null);
    }

    if (selectedCategory !== 'all') {
      const category = categoryStructure.find(
        (cat) => cat.id === selectedCategory,
      );
      if (category) {
        if (selectedSubcategory !== 'all') {
          const subcategory = category.subcategories.find(
            (sub) => sub.id === selectedSubcategory,
          );
          if (subcategory) {
            results = results.filter((book) =>
              book.category.some((cat) =>
                subcategory.keywords.some((keyword) =>
                  cat.toLowerCase().includes(keyword.toLowerCase()),
                ),
              ),
            );
          }
        } else {
          const allKeywords = category.subcategories.flatMap(
            (sub) => sub.keywords,
          );
          results = results.filter((book) =>
            book.category.some((cat) =>
              allKeywords.some((keyword) =>
                cat.toLowerCase().includes(keyword.toLowerCase()),
              ),
            ),
          );
        }
      }
    }

    return results;
  }, [books, searchQuery, showSales, selectedCategory, selectedSubcategory]);

  const totalPages = Math.ceil(filteredBooks.length / RESULTS_PER_PAGE);
  const paginatedBooks = useMemo(
    () =>
      filteredBooks.slice(
        (currentPage - 1) * RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE,
      ),
    [filteredBooks, currentPage],
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      className="search-modal"
      onClick={onClose}
    >
      <div
        className="search-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="search-modal__sidebar">
          <div className="search-modal__sales-section">
            <button
              className={`search-modal__sales-btn ${showSales ? 'search-modal__sales-btn--active' : ''}`}
              onClick={() => {
                setShowSales(!showSales);
                setCurrentPage(1);
              }}
            >
              Sales
            </button>
          </div>

          <div className="search-modal__categories">
            <button
              className={`search-modal__category-btn ${selectedCategory === 'all' ? 'search-modal__category-btn--active' : ''}`}
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setExpandedCategory(null);
                setCurrentPage(1);
              }}
            >
              All Categories
            </button>
            {categoryStructure.map((category) => (
              <div
                key={category.id}
                className="search-modal__category-group"
              >
                <button
                  className={`search-modal__category-btn ${selectedCategory === category.id ? 'search-modal__category-btn--active' : ''}`}
                  onClick={() => {
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id,
                    );
                    setSelectedCategory(category.id);
                    setSelectedSubcategory('all');
                    setCurrentPage(1);
                  }}
                >
                  {category.name}
                  <span className="search-modal__category-arrow">
                    {expandedCategory === category.id ? '▼' : '▶'}
                  </span>
                </button>
                {expandedCategory === category.id && (
                  <div className="search-modal__subcategories">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className={`search-modal__subcategory-btn ${selectedSubcategory === subcategory.id ? 'search-modal__subcategory-btn--active' : ''}`}
                        onClick={() => {
                          setSelectedSubcategory(subcategory.id);
                          setCurrentPage(1);
                        }}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="search-modal__main">
          <div className="search-modal__search-section">
            <input
              type="text"
              className="search-modal__input"
              placeholder="Search by keywords, topics, or messages"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              autoFocus
            />
          </div>

          <div className="search-modal__results">
            {searchQuery === '' && filteredBooks.length === 0 ?
              <div className="search-modal__empty">
                <div className="search-modal__empty-icon">
                  <Icon
                    name="search"
                    size={48}
                  />
                </div>
                <p className="search-modal__empty-text">Start typing...</p>
              </div>
            : filteredBooks.length === 0 ?
              <div className="search-modal__empty">
                <div className="search-modal__empty-icon">
                  <Icon
                    name="search"
                    size={48}
                  />
                </div>
                <p className="search-modal__empty-text">Nothing found</p>
              </div>
            : <div className="search-modal__results-list">
                {paginatedBooks.map((book) => (
                  <SearchResultCard
                    key={book.id}
                    book={book}
                    onCardClick={onClose}
                  />
                ))}
              </div>
            }
          </div>

          <div className="search-modal__footer">
            <div className="search-modal__pagination">
              {totalPages > 1 && currentPage > 1 && (
                <button
                  className="search-modal__prev-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              )}
              {totalPages > 1 && currentPage < totalPages && (
                <button
                  className="search-modal__next-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
