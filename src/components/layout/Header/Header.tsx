import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../../Logo';
import { SearchModal } from '../../shared/SearchModal/SearchModal';
import { AuthModal } from '../../ui/AuthModal';
import { UserMenu } from '../../ui/UserMenu';
import { SettingsMenu } from '../../ui/SettingsMenu';
import { useAuthContext } from '../../../contexts/AuthContext';
import '../Header/header.scss';
import { useRef, useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { useTheme } from './useTheme';
import { useCart } from '../../../hooks/useCart.tsx';
import { useFavorites } from '../../../hooks/useFavorites.tsx';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';

interface Props {
  isAuthModalOpen?: boolean;
  setIsAuthModalOpen?: (open: boolean) => void;
}

export function Header({
  isAuthModalOpen: externalIsAuthModalOpen,
  setIsAuthModalOpen: externalSetIsAuthModalOpen,
}: Props) {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [internalIsAuthModalOpen, setInternalIsAuthModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'uk'>('en');
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthContext();

  const isAuthModalOpen = externalIsAuthModalOpen ?? internalIsAuthModalOpen;
  const setIsAuthModalOpen =
    externalSetIsAuthModalOpen ?? setInternalIsAuthModalOpen;
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });
  const { isDark, toggleTheme } = useTheme();
  const theme = useMemo<'light' | 'dark'>(
    () => (isDark ? 'dark' : 'light'),
    [isDark],
  );

  const navListRef = useRef<HTMLUListElement>(null);

  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();

  const closeMenu = () => setIsOpenMenu(false);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpenMenu(!isMenuOpen);
  };

  const openSearchModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSearchModalOpen(true);
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const { scrollY } = useScroll();
  const headerBackgroundDark = useTransform(
    scrollY,
    [0, 20],
    ['rgba(34, 39, 61, 0)', 'rgba(20, 30, 50, 0.95)'],
  );
  const headerBackgroundLight = useTransform(
    scrollY,
    [0, 20],
    ['rgba(212, 196, 176, 0)', 'rgba(200, 185, 165, 0.95)'],
  );
  const headerBackground = useMotionValue('rgba(34, 39, 61, 0)');
  const headerScale = useTransform(scrollY, [0, 20], [1, 0.98]);

  useEffect(() => {
    const source = isDark ? headerBackgroundDark : headerBackgroundLight;
    headerBackground.set(source.get());
    return source.on('change', (v) => headerBackground.set(v));
  }, [isDark]);

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
    <motion.header
      className={isMenuOpen ? 'header header--menu-open' : 'header'}
      style={{
        backgroundColor: headerBackground,
        scale: headerScale,
      }}
    >
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
            <Search size={20} />
          </a>
          <NavLink
            onClick={closeMenu}
            className="icon icon--favourite"
            to={'favorites'}
          >
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span className="favorites-counter">{favoritesCount}</span>
            )}
          </NavLink>
          <NavLink
            onClick={closeMenu}
            className="icon icon--cart"
            to={'cart'}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
          </NavLink>

          {!isLoading && isAuthenticated && user ?
            <UserMenu
              avatarUrl={user.avatar_url}
              language={language}
              theme={theme}
              onLanguageChange={setLanguage}
              onThemeChange={handleThemeChange}
            />
          : !isLoading && !isAuthenticated ?
            <SettingsMenu
              language={language}
              theme={theme}
              onLanguageChange={setLanguage}
              onThemeChange={handleThemeChange}
              onSignUpClick={() => setIsAuthModalOpen(true)}
            />
          : null}
          <a
            href=""
            className="icon icon--menu"
            onClick={toggleMenu}
          >
            {isMenuOpen ?
              <X size={20} />
            : <Menu size={20} />}
          </a>
        </div>
      </div>

      <SearchModal
        key={String(isSearchModalOpen)}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.header>
  );
}
