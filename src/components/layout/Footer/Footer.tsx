import './Footer.scss';
import { Logo } from '../../Logo';
import { Icon } from '../../ui/Icon';
import { Link } from 'react-router-dom';

export function Footer() {
  const handleBackToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            GITHUB
          </Link>
          <Link
            className="footer__category"
            to="contacts"
          >
            CONTACTS
          </Link>
          <Link
            className="footer__category"
            to="team"
          >
            TEAM
          </Link>
          <Link
            className="footer__category"
            to="rights"
          >
            RIGHTS
          </Link>
        </nav>

        <button
          type="button"
          className="backTop"
          onClick={handleBackToTop}
        >
          Back to top
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
