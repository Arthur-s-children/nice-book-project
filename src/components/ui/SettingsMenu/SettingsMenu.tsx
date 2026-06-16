import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import './SettingsMenu.scss';

type Language = 'en' | 'uk';
type Theme = 'light' | 'dark';

interface Props {
  language: Language;
  theme: Theme;
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onSignUpClick?: () => void;
}

export function SettingsMenu({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
  onSignUpClick,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="settings-menu"
      ref={menuRef}
    >
      <button
        className="settings-menu__button"
        onClick={() => setIsOpen(true)}
        aria-label="Settings"
      >
        <SlidersHorizontal
          size={18}
          className="settings-menu__icon"
        />
      </button>

      {isOpen && (
        <div
          className="settings-menu__backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="settings-menu__modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="settings-menu__title">Preferences</h3>
            {onSignUpClick && (
              <button
                className="settings-menu__option settings-menu__option--primary"
                onClick={() => {
                  onSignUpClick();
                  setIsOpen(false);
                }}
              >
                Sign Up
              </button>
            )}
            <button
              className="settings-menu__option"
              onClick={() => {
                onLanguageChange(language === 'en' ? 'uk' : 'en');
                setIsOpen(false);
              }}
            >
              Change Language
            </button>
            <button
              className="settings-menu__option"
              onClick={() => {
                onThemeChange(theme === 'light' ? 'dark' : 'light');
                setIsOpen(false);
              }}
            >
              Change Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
