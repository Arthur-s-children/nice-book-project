import { Link, useParams } from 'react-router-dom';
import { NotFoundPage } from '../NotFoundPage';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './ProductPage.module.scss';
import { useState } from 'react';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper';
import { useBook } from '../../hooks/useBook.ts';
import { useBooks } from '../../hooks/useBooks.ts';
import { getImageUrl } from '../../services/getImageUrl.ts';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books = [], isLoading: isBooksLoading } = useBooks();

  const {
    data: book,
    isPending: isBookPending,
    error: isBookError,
  } = useBook(slug ?? '');

  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [activeImage, setActiveImage] = useState<string>();

  if (isBookPending) {
    return <h2>Loading...</h2>;
  }

  if (isBookError) {
    return <NotFoundPage />;
  }

  const inCart = cartIds.includes(book.id);
  const isFavorite = favoriteIds.includes(book.id);

  // const imageSrc = `/images/${book.images[0]}`;
  const imageSrc = getImageUrl(activeImage || book.images[0]);

  const relatedBooks = books
    .filter(
      (item) =>
        item.id !== book.id &&
        item.category.some((cat) => book.category.includes(cat)),
    )
    .slice(0, 10);

  return (
    <div className={styles.item_card}>
      <nav className={styles.breadcrumbs}>
        <Link
          to="/"
          className={styles.link}
        >
          <img
            src="/icons/home.svg"
            alt="Home"
          />
        </Link>

        <span className={styles.separator}>
          <img
            src="/icons/arrow-right.svg"
            alt=""
            aria-hidden="true"
          />
        </span>

        <Link
          to="/books/all"
          className={styles.link}
        >
          Books
        </Link>

        {book && (
          <>
            <span className={styles.separator}>
              <img
                src="/icons/arrow-right.svg"
                alt=""
                aria-hidden="true"
              />
            </span>
            <span className={styles.current}>{book.name}</span>
          </>
        )}
      </nav>
      <h1 className={styles.title}>{book.name}</h1>
      <p className={styles.paragraph}>{book.author}</p>

      <div className={styles.book_grid}>
        <div className={styles.image_container}>
          <div className={styles.main_image_wrap}>
            <img
              src={imageSrc}
              alt={book.name}
              className={styles.main_image}
            />
          </div>

          <div className={styles.thumbs}>
            {book.images.map((img) => (
              <button
                key={img}
                className={styles.thumb}
                onClick={() => setActiveImage(img)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={book.name}
                  className={styles.thumbnail_image}
                />
              </button>
            ))}
          </div>
        </div>

        <section className={styles.category_block}>
          <h5 className={styles.block_label_gray}>Category</h5>

          <div className={styles.categories}>
            {book.category.map((category) => (
              <span
                key={category}
                className={styles.btn_category}
              >
                {category}
              </span>
            ))}
          </div>

          <div className={styles.languages}>
            <h5 className={styles.block_label_gray}>Select language</h5>

            <div className={styles.btn_lang}>
              {book.lang_available.map((lang) => (
                <span
                  key={lang}
                  className={
                    lang === book.lang ?
                      styles.btn_lang_ua
                    : styles.btn_lang_eng
                  }
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.price_container}>
            <div className={styles.price}>
              <span className={styles.new_price}>
                ₴{book.price_discount ?? book.price_regular}
              </span>

              {book.price_discount && (
                <span className={styles.old_price}>₴{book.price_regular}</span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btn_add}
                onClick={() => !inCart && addToCart(book.id)}
              >
                {inCart ? 'Added' : 'Add to cart'}
              </button>

              <button
                className={styles.btn_favorite}
                aria-label="Favorite"
                onClick={() => toggleFavorite(book.id)}
              >
                <img
                  src={
                    isFavorite ? '/icons/heart-filled.svg' : '/icons/heart.svg'
                  }
                  alt="favorite"
                  className={styles.icon_heart}
                />
              </button>
            </div>
          </div>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>Author</td>
                <td>{book.author}</td>
              </tr>
              {book.cover_type && (
                <tr>
                  <td>Cover type</td>
                  <td>{book.cover_type}</td>
                </tr>
              )}

              {book.number_of_pages && (
                <tr>
                  <td>Number of pages</td>
                  <td>{book.number_of_pages}</td>
                </tr>
              )}

              <tr>
                <td>Year of publication</td>
                <td>{book.publication_year}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.about}>
          <h3 className={styles.section_title}>About</h3>
          <div className={styles.description}>
            {book.description.split('\n').map((paragraph) => (
              <p
                key={paragraph}
                className={styles.paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className={styles.characteristics_section}>
          <h3 className={styles.section_title}>Characteristics</h3>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>Author</td>
                <td>{book.author}</td>
              </tr>

              {book.cover_type && (
                <tr>
                  <td>Cover type</td>
                  <td>{book.cover_type}</td>
                </tr>
              )}

              {book.number_of_pages && (
                <tr>
                  <td>Number of pages</td>
                  <td>{book.number_of_pages}</td>
                </tr>
              )}

              <tr>
                <td>Year of publication</td>
                <td>{book.publication_year}</td>
              </tr>

              <tr>
                <td>Publication</td>
                <td>{book.publication}</td>
              </tr>

              {'format' in book && (
                <tr>
                  <td>Format</td>
                  <td>{book.format}</td>
                </tr>
              )}

              <tr>
                <td>Language</td>
                <td>{book.lang.toUpperCase()}</td>
              </tr>

              {'illustrations' in book && (
                <tr>
                  <td>Illustrations</td>
                  <td>{book.illustrations ? 'Yes' : 'No'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.recommended}>
        <BooksSwiper
          title="You may also like"
          books={relatedBooks}
          isLoading={isBooksLoading}
        />
      </section>
    </div>
  );
};
