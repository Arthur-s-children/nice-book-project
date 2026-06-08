import { HeroSection } from '../../components/shared/HeroSection/HeroSection.tsx';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper.tsx';
import { CategoriesSection } from '../../components/shared/CategoriesSection/CategoriesSection.tsx';
import './HomePage.scss';

export const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />

      <BooksSwiper title="New books" />

      <CategoriesSection />

      <BooksSwiper title="You might like" />
    </div>
  );
};
