import './Footer.scss';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const handleBackToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <h2 className="footer__slogan">
            Books that inspire,
            <br />
            stories that last
          </h2>
        </div>

        <div className="footer__right">
          <nav className="footer__links">
            <div className="footer__column">
              <h3 className="footer__column-title">Explore</h3>
              <ul className="footer__column-list">
                <li>
                  <Link
                    to="/catalog?type=paperback"
                    className="footer__link"
                  >
                    Paper Books
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?type=kindle"
                    className="footer__link"
                  >
                    Kindle
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?type=audiobook"
                    className="footer__link"
                  >
                    Audiobooks
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Company</h3>
              <ul className="footer__column-list">
                <li>
                  <Link
                    to="https://github.com/Arthur-s-children/nice-book-project"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="footer__link"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    to="contacts"
                    className="footer__link"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="team"
                    className="footer__link"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Info</h3>
              <ul className="footer__column-list">
                <li>
                  <Link
                    to="rights"
                    className="footer__link"
                  >
                    Rights
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__giant-text">nice books</div>
        <button
          type="button"
          className="footer__back-to-top"
          onClick={handleBackToTop}
        >
          Back to top
          <ArrowUp size={20} />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
