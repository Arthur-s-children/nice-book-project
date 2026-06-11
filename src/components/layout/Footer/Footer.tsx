import './Footer.scss';
import { Logo } from '../../Logo';
import { Icon } from '../../ui/Icon';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const handleBackToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <a
          href="/"
          className="logo"
        >
          <Logo />
        </a>

        <nav className="footer__categories">
          <Link
            className="footer__category"
            to="https://github.com/Arthur-s-children/nice-book-project"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('footer.github')}
          </Link>
          <Link
            className="footer__category"
            to="contacts"
          >
            {t('footer.contacts')}
          </Link>
          <Link
            className="footer__category"
            to="rights"
          >
            {t('footer.rights')}
          </Link>
        </nav>

        <button
          type="button"
          className="backTop"
          onClick={handleBackToTop}
        >
          {t('footer.backToTop')}
          <Icon
            name="arrow-up-dark"
            size={8}
          />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
