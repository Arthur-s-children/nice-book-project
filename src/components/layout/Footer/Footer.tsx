import './Footer.scss';
import { Logo } from '../../Logo';
import { Icon } from '../../Icon';

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

        <nav className="categories">
          <a
            className="category"
            href="#github"
          >
            GITHUB
          </a>
          <a
            className="category"
            href="#contacts"
          >
            CONTACTS
          </a>
          <a
            className="category"
            href="#rights"
          >
            RIGHTS
          </a>
        </nav>

        <button
          type="button"
          className="backTop"
          onClick={handleBackToTop}
        >
          Back to top
          <Icon name="arrow-up" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
