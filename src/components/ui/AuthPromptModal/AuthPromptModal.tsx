import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import './AuthPromptModal.scss';

export function AuthPromptModal() {
  const { isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShownThisSession = sessionStorage.getItem('authPromptShown');

    if (!isAuthenticated && !hasShownThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('authPromptShown', 'true');
      }, 60000); // 1 minute

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
            // Trigger auth modal - this will be handled by parent component
            const event = new CustomEvent('openAuthModal');
            window.dispatchEvent(event);
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
