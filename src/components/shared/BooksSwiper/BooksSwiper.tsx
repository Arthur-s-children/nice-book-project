import './BooksSwiper.scss';

export const BooksSwiper = ({ title }: { title: string }) => {
  return (
    <section className="books-swiper">
      <div className="books-swiper__header">
        <h2>{title}</h2>
      </div>

      <div className="books-swiper__placeholder">Slider coming soon</div>
    </section>
  );
};
