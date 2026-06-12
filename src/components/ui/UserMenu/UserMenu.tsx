import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import './UserMenu.scss';

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
            Personal Data
          </button>
          <button
            className="user-menu__item"
            onClick={() => handleNavigate('/orders')}
          >
            Order History
          </button>
          <div className="user-menu__divider" />
          <button
            className="user-menu__item"
            onClick={() => onLanguageChange(language === 'en' ? 'uk' : 'en')}
          >
            Change Language
          </button>
          <button
            className="user-menu__item"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            Change Theme
          </button>
          <div className="user-menu__divider" />
          <button
            className="user-menu__item user-menu__item--danger"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
