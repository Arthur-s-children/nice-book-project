import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import './UserMenu.scss';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'uk';
type Theme = 'light' | 'dark';

type Props = {
  avatarUrl?: string;
  language: Language;
  theme: Theme;
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: Theme) => void;
};

export function UserMenu({
  avatarUrl,
  language,
  theme,
  onLanguageChange,
  onThemeChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div
      className="user-menu"
      ref={menuRef}
    >
      <button
        className="user-menu__avatar"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundImage:
            avatarUrl ? `url(${avatarUrl})` : 'url(/icons/user-icon.png)',
        }}
      />

      {isOpen && (
        <div className="user-menu__dropdown">
          <button
            className="user-menu__item"
            onClick={() => handleNavigate('/profile')}
          >
            {t('userMenu.personalData')}
          </button>
          <button
            className="user-menu__item"
            onClick={() => handleNavigate('/orders')}
          >
            {t('userMenu.orderHistory')}
          </button>
          <div className="user-menu__divider" />
          <button
            className="user-menu__item"
            onClick={() => onLanguageChange(language === 'en' ? 'uk' : 'en')}
          >
            {t('userMenu.changeLanguage')}
          </button>
          <button
            className="user-menu__item"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            {t('userMenu.changeTheme')}
          </button>
          <div className="user-menu__divider" />
          <button
            className="user-menu__item user-menu__item--danger"
            onClick={handleSignOut}
          >
            {t('userMenu.signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
