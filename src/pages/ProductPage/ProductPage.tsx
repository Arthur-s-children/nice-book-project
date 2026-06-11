import { Link, useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services';
import { NotFoundPage } from '../NotFoundPage';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './ProductPage.module.scss';
import { useState, useCallback, useMemo } from 'react';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper';
import { useTranslation } from 'react-i18next';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const books = bookService.getAll();
  const book = books.find((b) => b.slug === slug);

  const [activeImage, setActiveImage] = useState<string>(() => {
    return book?.images?.[0] ?? '';
  });

  const relatedBooks = useMemo(() => {
    if (!book) return [];

    return books
      .filter(
        (item) =>
          item.id !== book.id &&
          item.category.some((cat) => book.category.includes(cat)),
      )
      .slice(0, 10);
  }, [books, book]);

  const languageVersions = useMemo(() => {
    if (!book) return [];

    return books
      .filter((item) => item.namespaceId === book.namespaceId)
      .reduce(
        (acc, item) => {
          if (!acc.find((i) => i.lang === item.lang)) {
            acc.push(item);
          }
          return acc;
        },
        [] as (typeof books)[number][],
      );
  }, [books, book]);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      const translatedBook = languageVersions.find(
        (item) => item.lang === lang,
      );

      if (translatedBook) {
        navigate(`/products/${translatedBook.slug}`);
      }
    },
    [languageVersions, navigate],
  );

  if (!book) return <NotFoundPage />;

  const inCart = cartIds.includes(book.id);
  const isFavorite = favoriteIds.includes(book.id);

  const imageSrc = `${import.meta.env.BASE_URL}${activeImage || book.images[0]}`;

  return (
    <div className={styles.item_card}>
      <nav className={styles.breadcrumbs}>
        <Link
          to="/"
          className={styles.link}
        >
          <img
            src="/icons/home.svg"
            alt={t('common.home')}
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
          {t('common.books')}
        </Link>

        <span className={styles.separator}>
          <img
            src="/icons/arrow-right.svg"
            alt=""
            aria-hidden="true"
          />
        </span>

        <span className={styles.current}>{book.name}</span>
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
                type="button"
                key={img}
                className={styles.thumb}
                onClick={() => setActiveImage(img)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${img}`}
                  alt={book.name}
                  className={styles.thumbnail_image}
                />
              </button>
            ))}
          </div>
        </div>

        <section className={styles.category_block}>
          <h5 className={styles.block_label_gray}>{t('product.category')}</h5>

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
            <h5 className={styles.block_label_gray}>
              {t('product.selectLanguage')}
            </h5>

            <div className={styles.btn_lang}>
              {languageVersions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.lang === book.lang}
                  onClick={() => handleLanguageChange(item.lang)}
                  className={
                    item.lang === book.lang ?
                      styles.btn_lang_ua
                    : styles.btn_lang_eng
                  }
                >
                  {item.lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.price_container}>
            <div className={styles.price}>
              <span className={styles.new_price}>
                ${book.priceDiscount ?? book.priceRegular}
              </span>

              {book.priceDiscount && (
                <span className={styles.old_price}>${book.priceRegular}</span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btn_add}
                onClick={() => !inCart && addToCart(book.id)}
              >
                {inCart ? t('product.added') : t('product.addToCart')}
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
                <td>{t('product.author')}</td>
                <td>{book.author}</td>
              </tr>
              {'coverType' in book && book.coverType && (
                <tr>
                  <td>{t('product.coverType')}</td>
                  <td>{book.coverType}</td>
                </tr>
              )}

              {'numberOfPages' in book && (
                <tr>
                  <td>{t('product.numberOfPages')}</td>
                  <td>{book.numberOfPages}</td>
                </tr>
              )}

              <tr>
                <td>{t('product.publicationYear')}</td>
                <td>{book.publicationYear}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.about}>
          <h3 className={styles.section_title}>{t('product.about')}</h3>
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
          <h3 className={styles.section_title}>
            {t('product.characteristics')}
          </h3>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>{t('product.author')}</td>
                <td>{book.author}</td>
              </tr>

              {'coverType' in book && book.coverType && (
                <tr>
                  <td>{t('product.coverType')}</td>
                  <td>{book.coverType}</td>
                </tr>
              )}

              {'numberOfPages' in book && (
                <tr>
                  <td>{t('product.numberOfPages')}</td>
                  <td>{book.numberOfPages}</td>
                </tr>
              )}

              <tr>
                <td>{t('product.publicationYear')}</td>
                <td>{book.publicationYear}</td>
              </tr>

              <tr>
                <td>{t('product.publication')}</td>
                <td>{book.publication}</td>
              </tr>

              {'format' in book && (
                <tr>
                  <td>{t('product.format')}</td>
                  <td>{book.format}</td>
                </tr>
              )}

              <tr>
                <td>{t('product.language')}</td>
                <td>{book.lang.toUpperCase()}</td>
              </tr>

              {'illustrations' in book && (
                <tr>
                  <td>{t('product.illustrations')}</td>
                  <td>
                    {book.illustrations ? t('product.yes') : t('product.no')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.recommended}>
        <BooksSwiper
          title={t('product.recommended')}
          books={relatedBooks}
        />
      </section>
    </div>
  );
};
