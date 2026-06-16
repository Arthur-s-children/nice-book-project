import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { HeroSlidesSection } from '../../components/shared/HeroSection/HeroSlidesSection';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import { DiscountsSection } from '../../components/shared/DiscountsSection/DiscountsSection';
import { DontMissSection } from '../../components/shared/DontMissSection/DontMissSection';
import './HomePage.scss';
import { useTranslation } from 'react-i18next';
import { useBooks } from '../../hooks/useBooks.ts';

export const HomePage = () => {
  const { data: books = [], isLoading } = useBooks();
  const suggestedBooks = books.slice(40, 50);
  const readingQuotes = [
    {
      text: 'Reading is a conversation between the reader and the author.',
      author: 'Rita Dove',
    },
    {
      text: 'A room without books is like a body without a soul.',
      author: 'Cicero',
    },
  ];
  const { t } = useTranslation();
  const newBooks = books.slice(30, 40); // Перші 10 нових книг
  const suggestedBooks = books.slice(40, 50); // Книги для рекомендацій

  return (
    <>
      <HeroSection />

      <div style={{ width: '100%', marginTop: '24px' }}>
        <DiscountsSection
          books={books}
      <div className="home-page">
        <BooksSwiper
          title={t('home.newBooks')}
          books={newBooks}
          isLoading={isLoading}
        />
      </div>

      <HeroSlidesSection />

      <BooksSwiper
        title="You might like"
        books={suggestedBooks}
        isLoading={isLoading}
      />

      <section
        className="home-page__quotes-section"
        aria-label="Reading quotes"
      >
        <div className="home-page__quotes-wrapper">
          {readingQuotes.map(({ text, author }) => (
            <article
              key={text}
              className="home-page__quote-card"
            >
              <p className="home-page__quote-text">“{text}”</p>
              <span className="home-page__quote-author">— {author}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="home-page">
        <CategoriesSection />

        <DontMissSection />
      </div>
    </>
  );
};
