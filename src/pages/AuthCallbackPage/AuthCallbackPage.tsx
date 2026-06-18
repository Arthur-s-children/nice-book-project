import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import './AuthCallbackPage.scss';
import { useTranslation } from 'react-i18next';

export function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          setStatus('success');
          setMessage(t('authCallback.emailConfirm'));
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          setStatus('success');
          setMessage(t('authCallback.alreadySignIn'));
          setTimeout(() => navigate('/'), 1500);
          return;
        }

        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            if (timeoutId) clearTimeout(timeoutId);
            sub.unsubscribe();
            setStatus('success');
            setMessage(t('authCallback.alreadySignIn'));
            setTimeout(() => navigate('/'), 1500);
          }
        });
        subscription = sub;

        timeoutId = setTimeout(() => {
          sub.unsubscribe();
          setStatus('error');
          setMessage(t('authCallback.invalidLink'));
        }, 5000);
      } catch (error: unknown) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(
          error instanceof Error ?
            error.message
          : t('authCallback.confirmError'),
        );
      }
    };

    void handleCallback();

    return () => {
      subscription?.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, t]);

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-page__container">
        {status === 'loading' && (
          <div className="auth-callback-page__loading">
            <h1>{t('authCallback.confirmTitle')}</h1>
            <p>{t('authCallback.confirmText')}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-callback-page__success">
            <h1>{t('authCallback.successTitle')}</h1>
            <p>{message}</p>
            <p>{t('authCallback.redirect')}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-callback-page__error">
            <h1>{t('authCallback.errorTitle')}</h1>
            <p>{message}</p>
            <button onClick={() => navigate('/')}>
              {t('authCallback.goHome')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
