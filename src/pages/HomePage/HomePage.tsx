import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import './HomePage.scss';
import { useBooks } from '../../hooks/useBooks.ts';

export const HomePage = () => {
  const { data: books = [], isLoading } = useBooks();
  const newBooks = books.slice(30, 40); // Перші 10 нових книг
  const suggestedBooks = books.slice(40, 50); // Книги для рекомендацій

  return (
    <>
      <HeroSection isLoading={isLoading} />
      <div className="home-page">
        <BooksSwiper
          title="New books"
          books={newBooks}
          isLoading={isLoading}
        />

        <CategoriesSection isLoading={isLoading} />

        <BooksSwiper
          title="You might like"
          books={suggestedBooks}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
