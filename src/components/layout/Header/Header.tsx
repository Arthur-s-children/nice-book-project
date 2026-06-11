import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../../Logo';
import { Icon } from '../../ui/Icon';
import { SearchModal } from '../../shared/SearchModal/SearchModal';
import '../Header/header.scss';
import { useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import { useTheme } from './useTheme';

export function Header() {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });
  const { isDark, toggleTheme } = useTheme();

  const navListRef = useRef<HTMLUListElement>(null);

  const location = useLocation();

  const closeMenu = () => setIsOpenMenu(false);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpenMenu(!isMenuOpen);
  };

  const openSearchModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSearchModalOpen(true);
  };

  useEffect(() => {
    const activeLink = navListRef.current?.querySelector(
      '.nav__link--active',
    ) as HTMLElement;
    if (activeLink && navListRef.current) {
      const navRect = navListRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        visible: true,
      });
    }
  }, [location]);

  return (
    <header className={isMenuOpen ? 'header header--menu-open' : 'header'}>
      <div className="top-bar">
        <a
          href="#"
          className="top-bar__logo"
          onClick={closeMenu}
        >
          <Logo className="top-bar__logo-image" />
        </a>

        <nav className="nav header__nav">
          <ul
            className="nav__list"
            ref={navListRef}
          >
            <li className="nav__item">
              <NavLink
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn('nav__link', { 'nav__link--active': isActive })
                }
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                onClick={closeMenu}
                className={() =>
                  cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=paperback',
                  })
                }
                to="/catalog?type=paperback"
              >
                Paper
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                onClick={closeMenu}
                className={() =>
                  cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=kindle',
                  })
                }
                to="/catalog?type=kindle"
              >
                Kindle
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                onClick={closeMenu}
                className={() =>
                  cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=audiobook',
                  })
                }
                to="/catalog?type=audiobook"
              >
                Audiobook
              </NavLink>
            </li>
            <div
              className="nav__indicator"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
          </ul>
        </nav>

        <div className="top-bar__icons">
          <input
            type="text"
            className="input"
            onClick={openSearchModal}
            readOnly
          />
          <a
            href=""
            className="icon icon--search"
            onClick={openSearchModal}
          >
            <Icon name="search" />
          </a>
          <NavLink
            onClick={closeMenu}
            className="icon icon--favourite"
            to={'favorites'}
          >
            <Icon name="heart" />
          </NavLink>
          <NavLink
            onClick={closeMenu}
            className="icon icon--cart"
            to={'cart'}
          >
            <Icon name="cart" />
          </NavLink>
          <button
            className="icon icon--theme"
            onClick={toggleTheme}
          >
            {isDark ? '☀️' : '🌘'}
          </button>
          <a
            href=""
            className="icon icon--menu"
            onClick={toggleMenu}
          >
            <Icon name={isMenuOpen ? 'close' : 'burger'} />
          </a>
        </div>
      </div>

      <SearchModal
        key={String(isSearchModalOpen)}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
}
