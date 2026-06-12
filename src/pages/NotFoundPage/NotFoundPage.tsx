import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../components/ui/Button';
import styles from './NotFoundPage.module.scss';
import { getImageUrl } from '../../services/getImageUrl.ts';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles['not-found']}>
      <img
        className={styles['not-found__gif']}
        src={getImageUrl('not-found-fire.gif')}
        alt="Lost page"
      />

      <div className={styles['not-found__content']}>
        <div className={styles['not-found__title']}>
          <h1>Chapter 404</h1>
          <h2>The Missing Page</h2>
        </div>

        <p className={styles['not-found__desc']}>
          The page you're looking for seems to be missing from our story.
        </p>

        <div className={styles['not-found__button']}>
          <AppButton
            variant="primary"
            onClick={() => navigate('/')}
          >
            Go Home
          </AppButton>
        </div>
      </div>
    </div>
  );
};
