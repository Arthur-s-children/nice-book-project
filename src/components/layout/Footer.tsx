import '.footer/Footer.scss';
import logo from './footer/Logo.svg';
import stroke from './footer/Stroke.svg';

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <a
          href="/"
          className="logo"
        >
          <img
            src={logo}
            alt="Footer logo"
          />
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
          <img
            src={stroke}
            className="backTopIcon"
            alt="Arrow up"
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
