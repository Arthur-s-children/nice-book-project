import { useState, useEffect, useMemo } from 'react';
import { bookService } from '../../../services/bookService';
import { SearchResultCard } from '../SearchResultCard/SearchResultCard';
import { Icon } from '../../ui/Icon';
import './SearchModal.scss';

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

  const categoryStructure = useMemo(
    () => [
      {
        id: 'fiction',
        name: 'Fiction',
        subcategories: [
          {
            id: 'sci-fi',
            name: 'Sci-Fi',
            keywords: ['Sci-Fi', 'Science Fiction'],
          },
          { id: 'fantasy', name: 'Fantasy', keywords: ['Fantasy'] },
          {
            id: 'mystery',
            name: 'Mystery & Thrillers',
            keywords: ['Mystery', 'Thriller'],
          },
          {
            id: 'romance',
            name: 'Romance',
            keywords: ['Romance', 'Classic', 'Literature'],
          },
          {
            id: 'historical',
            name: 'Historical Fiction',
            keywords: ['Historical Fiction'],
          },
          { id: 'horror', name: 'Horror', keywords: ['Horror'] },
        ],
      },
      {
        id: 'non-fiction',
        name: 'Non-Fiction',
        subcategories: [
          {
            id: 'business',
            name: 'Business & Management',
            keywords: ['Business', 'Management'],
          },
          { id: 'psychology', name: 'Psychology', keywords: ['Psychology'] },
          {
            id: 'finance',
            name: 'Finance & Investments',
            keywords: ['Finance', 'Investments', 'Securities'],
          },
          {
            id: 'biographies',
            name: 'Biographies',
            keywords: ['Biographies', 'Company Stories', 'Success Stories'],
          },
        ],
      },
      {
        id: 'technology',
        name: 'Technology',
        subcategories: [
          {
            id: 'programming',
            name: 'Programming',
            keywords: ['Programming', 'Software Development', 'Algorithms'],
          },
          {
            id: 'design',
            name: 'Design',
            keywords: ['Graphic Design', 'Design', 'Data Visualization'],
          },
          {
            id: 'gaming',
            name: 'Computer Games',
            keywords: ['Computer games'],
          },
        ],
      },
      {
        id: 'children',
        name: "Children's Books",
        subcategories: [
          {
            id: 'fairy-tales',
            name: 'Fairy Tales',
            keywords: ['Fairy tales', "Children's fiction"],
          },
          {
            id: 'educational',
            name: 'Educational',
            keywords: ['Educational', "Children's and YA"],
          },
        ],
      },
    ],
    [],
  );

  const filteredBooks = useMemo(() => {
    let results = bookService.search(searchQuery);

    if (showSales) {
      results = results.filter((book) => book.priceDiscount !== null);
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
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    showSales,
    categoryStructure,
  ]);

  const totalPages = Math.ceil(filteredBooks.length / RESULTS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
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
