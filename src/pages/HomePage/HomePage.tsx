import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import { bookService } from '../../services/bookService.ts';
import './HomePage.scss';

export const HomePage = () => {
  const newBooks = bookService.getAll().slice(0, 10); // Перші 10 нових книг
  const suggestedBooks = bookService.getAll().slice(10, 20); // Книги для рекомендацій

  return (
    <>
      <HeroSection />
      <div className="home-page">
        <BooksSwiper
          title="New books"
          books={newBooks}
        />

        <CategoriesSection />

        <BooksSwiper
          title="You might like"
          books={suggestedBooks}
        />
      </div>
    </>
  );
};
