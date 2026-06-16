import { Link, useParams, useNavigate } from 'react-router-dom';
import { NotFoundPage } from '../NotFoundPage';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import styles from './ProductPage.module.scss';
import { useState, useCallback, useMemo } from 'react';
import { BooksSwiper } from '../../components/shared/BooksSwiper/BooksSwiper';
import { useBook } from '../../hooks/useBook.ts';
import { useBooks } from '../../hooks/useBooks.ts';
import { getImageUrl } from '../../services/getImageUrl.ts';
import { Icon } from '../../components/ui/Icon/Icon.tsx';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '../../components/shared/PageLoader/PageLoader.tsx';
import { useMinimumLoader } from '../../hooks/useMinimumLoader.ts';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books = [], isLoading: isBooksLoading } = useBooks();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: book,
    isPending: isBookPending,
    error: isBookError,
  } = useBook(slug ?? '');

  const showLoader = useMinimumLoader(isBookPending, 1500);

  const { cartIds, addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [activeImage, setActiveImage] = useState<string>();

  const TITLES: Record<string, string> = {
    paperback: t('catalog.title.paperback'),
    kindle: t('catalog.title.kindle'),
    audiobook: t('catalog.title.audiobook'),
  };

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
      .filter((item) => item.namespace_id === book.namespace_id)
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

  if (showLoader) {
    return <PageLoader />;
  }

  if (isBookError || !book) {
    return <NotFoundPage />;
  }

  const inCart = cartIds.includes(book.id);
  const isFavorite = favoriteIds.includes(book.id);

  const type = book.type;

  const imageSrc = getImageUrl(activeImage || book.images[0]);

  return (
    <div className={styles.item_card}>
      <nav className={styles.breadcrumbs}>
        <Link
          to="/"
          className={styles.link}
        >
          <Icon name="home" />
        </Link>

        <span className={styles.separator}>
          <Icon name="arrow-right" />
        </span>

        <Link
          to={`/catalog?type=${type}`}
          className={styles.link}
        >
          {TITLES[type] ?? type}
        </Link>

        <span className={styles.separator}>
          <Icon name="arrow-right" />
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
                key={img}
                type="button"
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
                ₴{book.price_discount ?? book.price_regular}
              </span>

              {book.price_discount && (
                <span className={styles.old_price}>₴{book.price_regular}</span>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btn_add}
                onClick={() => addToCart(book.id)}
                disabled={inCart}
              >
                {inCart ? t('product.added') : t('product.addToCart')}
              </button>

              <button
                className={styles.btn_favorite}
                aria-label="Favorite"
                onClick={() => toggleFavorite(book.id)}
              >
                {isFavorite ?
                  <Icon name="heart-filled" />
                : <Icon name="heart" />}
              </button>
            </div>
          </div>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>{t('product.author')}</td>
                <td>{book.author}</td>
              </tr>
              {book.cover_type && (
                <tr>
                  <td>{t('product.coverType')}</td>
                  <td>{book.cover_type}</td>
                </tr>
              )}

              {book.number_of_pages && (
                <tr>
                  <td>{t('product.numberOfPages')}</td>
                  <td>{book.number_of_pages}</td>
                </tr>
              )}

              <tr>
                <td>{t('product.publicationYear')}</td>
                <td>{book.publication_year}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.about}>
          <h3 className={styles.section_title}>{t('product.about')}</h3>
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
          <h3 className={styles.section_title}>
            {t('product.characteristics')}
          </h3>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>{t('product.author')}</td>
                <td>{book.author}</td>
              </tr>

              {book.cover_type && (
                <tr>
                  <td>{t('product.coverType')}</td>
                  <td>{book.cover_type}</td>
                </tr>
              )}

              {book.number_of_pages && (
                <tr>
                  <td>{t('product.numberOfPages')}</td>
                  <td>{book.number_of_pages}</td>
                </tr>
              )}

              <tr>
                <td>{t('product.publicationYear')}</td>
                <td>{book.publication_year}</td>
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
          isLoading={isBooksLoading}
        />
      </section>
    </div>
  );
};
