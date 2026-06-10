import { useParams } from 'react-router-dom';
import { bookService } from '../../services';
import { NotFoundPage } from '../NotFoundPage';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './ProductPage.module.scss';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const book = bookService.getAll().find((b) => b.slug === slug);

  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  if (!book) {
    return <NotFoundPage />;
  }

  const inCart = cartIds.includes(book?.id);
  const isFavorite = favoriteIds.includes(book.id);

  // const imageSrc = `/images/${book.images[0]}`;
  const imageSrc = `${import.meta.env.BASE_URL}${book.images[0]}`;

  return (
    <div className={styles.item_card}>
      <h1 className={styles.title}>{book.name}</h1>
      <p className={styles.paragraph}>{book.author}</p>

      <div className={styles.book_grid}>
        <div className={styles.image_container}>
          <img
            src={imageSrc}
            alt={book.name}
            className={styles.image}
          />
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
              {book.langAvailable.map((lang) => (
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
                ₴{book.priceDiscount ?? book.priceRegular}
              </span>

              {book.priceDiscount && (
                <span className={styles.old_price}>₴{book.priceRegular}</span>
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
              {'coverType' in book && book.coverType && (
                <tr>
                  <td>Cover type</td>
                  <td>{book.coverType}</td>
                </tr>
              )}

              {'numberOfPages' in book && (
                <tr>
                  <td>Number of pages</td>
                  <td>{book.numberOfPages}</td>
                </tr>
              )}

              <tr>
                <td>Year of publication</td>
                <td>{book.publicationYear}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.about}>
          <h3 className={styles.section_title}>About</h3>
          <div className={styles.description}>
            {book.description.map((paragraph, index) => (
              <p
                key={index}
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

              {'coverType' in book && book.coverType && (
                <tr>
                  <td>Cover type</td>
                  <td>{book.coverType}</td>
                </tr>
              )}

              {'numberOfPages' in book && (
                <tr>
                  <td>Number of pages</td>
                  <td>{book.numberOfPages}</td>
                </tr>
              )}

              <tr>
                <td>Year of publication</td>
                <td>{book.publicationYear}</td>
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
    </div>
  );
};
