import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../../Logo';
import { Icon } from '../../ui/Icon';
import { SearchModal } from '../../shared/SearchModal/SearchModal';
import '../Header/header.scss';
import { useState } from 'react';
import cn from 'classnames';

export function Header() {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();

  // Closing the menu when clicking a link is better handled by an onClick
  const closeMenu = () => setIsOpenMenu(false);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpenMenu(!isMenuOpen);
  };

  const openSearchModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSearchModalOpen(true);
  };

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
          <ul className="nav__list">
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
