import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../components/ui/Button';
import styles from './NotFoundPage.module.scss';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <div className={styles['not-found']}>
      <img
        className={styles['not-found__gif']}
        src="../../../public/not-found-fire.gif"
        alt={t('notFound.imageAlt')}
      />

      <div className={styles['not-found__content']}>
        <div className={styles['not-found__title']}>
          <h1>{t('notFound.chapter')}</h1>
          <h2>{t('notFound.title')}</h2>
        </div>

        <p className={styles['not-found__desc']}>{t('notFound.description')}</p>

        <div className={styles['not-found__button']}>
          <AppButton
            variant="primary"
            onClick={() => navigate('/')}
          >
            {t('notFound.goHome')}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
