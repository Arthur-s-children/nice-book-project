import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import './HomePage.scss';
import { useTranslation } from 'react-i18next';
import { useBooks } from '../../hooks/useBooks.ts';

export const HomePage = () => {
  const { data: books = [], isLoading } = useBooks();
  const { t } = useTranslation();
  const newBooks = books.slice(30, 40); // Перші 10 нових книг
  const suggestedBooks = books.slice(40, 50); // Книги для рекомендацій

  return (
    <>
      <HeroSection />
      <div className="home-page">
        <BooksSwiper
          title={t('home.newBooks')}
          books={newBooks}
          isLoading={isLoading}
        />

        <CategoriesSection />

        <BooksSwiper
          title={t('home.youMightLike')}
          books={suggestedBooks}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
