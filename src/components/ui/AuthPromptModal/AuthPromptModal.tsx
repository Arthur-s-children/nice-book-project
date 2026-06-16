import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import './AuthPromptModal.scss';

export function AuthPromptModal() {
  const { isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasShownThisSession = sessionStorage.getItem('authPromptShown');

    if (!isAuthenticated && !hasShownThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('authPromptShown', 'true');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isOpen || isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-prompt-modal">
      <div
        className="auth-prompt-modal__overlay"
        onClick={() => setIsOpen(false)}
      />
      <div className="auth-prompt-modal__content">
        <h2 className="auth-prompt-modal__title">Sign In</h2>
        <p className="auth-prompt-modal__text">
          Sign in to access your personal data, order history, and more
          features.
        </p>
        <button
          className="auth-prompt-modal__button"
          onClick={() => {
            setIsOpen(false);
            window.dispatchEvent(new CustomEvent('openAuthModal'));
          }}
        >
          Sign In
        </button>
        <button
          className="auth-prompt-modal__close"
          onClick={() => setIsOpen(false)}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
