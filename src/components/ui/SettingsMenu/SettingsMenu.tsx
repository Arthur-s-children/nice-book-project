import { useState, useRef, useEffect } from 'react';
import './SettingsMenu.scss';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'uk';
type Theme = 'light' | 'dark';

interface Props {
  language: Language;
  theme: Theme;
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: Theme) => void;
}

export function SettingsMenu({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <img
          src="/icons/icon-settings.png"
          alt="Settings"
          className="settings-menu__icon"
        />
      </button>

      {isOpen && (
        <div className="settings-menu__dropdown">
          <button
            className="settings-menu__option"
            onClick={() => onLanguageChange(language === 'en' ? 'uk' : 'en')}
          >
            {t('settingsMenu.changeLanguage')}
          </button>
          <button
            className="settings-menu__option"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            {t('settingsMenu.changeTheme')}
          </button>
        </div>
      )}
    </div>
  );
}
