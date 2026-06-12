import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import { bookService } from '../../services';
import './HomePage.scss';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { t } = useTranslation();

  const newBooks = bookService.getAll().slice(0, 10); // Перші 10 нових книг
  const suggestedBooks = bookService.getAll().slice(10, 20); // Книги для рекомендацій

  return (
    <>
      <HeroSection />
      <div className="home-page">
        <BooksSwiper
          title={t('home.newBooks')}
          books={newBooks}
        />

        <CategoriesSection />

        <BooksSwiper
          title={t('home.youMightLike')}
          books={suggestedBooks}
        />
      </div>
    </>
  );
};
