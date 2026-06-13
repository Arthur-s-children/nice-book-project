import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import './AuthCallbackPage.scss';

export function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Email confirmed successfully! You are now signed in.');

          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (data.session) {
            setStatus('success');
            setMessage('You are already signed in.');
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Invalid confirmation link or no session found.');
          }
        }
      } catch (error: unknown) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(
          error instanceof Error ?
            error.message
          : 'An error occurred during email confirmation.',
        );
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-page__container">
        {status === 'loading' && (
          <div className="auth-callback-page__loading">
            <h1>Confirming your email...</h1>
            <p>Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-callback-page__success">
            <h1>Success!</h1>
            <p>{message}</p>
            <p>Redirecting to home page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-callback-page__error">
            <h1>Error</h1>
            <p>{message}</p>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}
