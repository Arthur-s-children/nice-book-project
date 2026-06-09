import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../../Logo';
import { Icon } from '../../ui/Icon';
import '../Header/header.scss';
import { useEffect, useState } from 'react';
import cn from 'classnames';

export function Header() {
  const [isMenuOpen, setIsOpenMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const closeMenu = async () => {
      await setIsOpenMenu(false);
    };
    closeMenu();
  }, [location.pathname]);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpenMenu(!isMenuOpen);
  };

  return (
    <header className={isMenuOpen ? 'header header--menu-open' : 'header'}>
      <div className="top-bar">
        <a
          href="#"
          className="top-bar__logo"
        >
          <Logo className="top-bar__logo-image" />
        </a>

        <nav className="nav header__nav">
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink
                className={({ isActive }) => {
                  return cn('nav__link', {
                    'nav__link--active': isActive,
                  });
                }}
                to="/"
              >
                Home
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink
                className={() => {
                  return cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=paperback',
                  });
                }}
                to="/catalog?type=paperback"
              >
                Paper
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink
                className={() => {
                  return cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=kindle',
                  });
                }}
                to="/catalog?type=kindle"
              >
                Kindle
              </NavLink>
            </li>

            <li className="nav__item">
              <NavLink
                className={() => {
                  return cn('nav__link', {
                    'nav__link--active':
                      location.pathname === '/catalog' &&
                      location.search === '?type=audiobook',
                  });
                }}
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
          />
          <input
            type="text"
            className="dropdouwn"
          />
          <a
            href=""
            className="icon icon--search"
          >
            <Icon name="search" />
          </a>

          <NavLink
            className="icon icon--favourite"
            to={'favorites'}
          >
            <Icon name="heart" />
          </NavLink>

          <NavLink
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
    </header>
  );
}
