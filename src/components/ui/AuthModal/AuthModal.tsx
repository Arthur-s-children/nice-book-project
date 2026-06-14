import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Icon } from '../Icon';
import './AuthModal.scss';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = {
  email: string;
  password: string;
  fullName?: string;
};

export function AuthModal({ isOpen, onClose }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string>('');
  const { signIn, signUp, signInWithGoogle, isSigningIn, isSigningUp } =
    useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
        onClose();
      } else {
        await signUp(data.email, data.password, data.fullName);
        setError('');
        alert(
          'Registration successful! Please check your email to confirm your account.',
        );
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal"
      onClick={onClose}
    >
      <div
        className="auth-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-modal__close"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>

        <h2 className="auth-modal__title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>

        {error && <div className="auth-modal__error">{error}</div>}

        <form
          key={isLogin ? 'login' : 'signup'}
          className="auth-modal__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!isLogin && (
            <div className="auth-modal__field">
              <input
                type="text"
                placeholder="Full Name"
                className="auth-modal__input"
                {...register('fullName')}
              />
            </div>
          )}

          <div className="auth-modal__field">
            <input
              type="email"
              placeholder="Email"
              className="auth-modal__input"
              onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="auth-modal__error-text">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="auth-modal__field">
            <input
              type="password"
              placeholder="Password"
              className="auth-modal__input"
              onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <span className="auth-modal__error-text">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={isSigningIn || isSigningUp}
          >
            {isSigningIn || isSigningUp ?
              'Loading...'
            : isLogin ?
              'Sign In'
            : 'Sign Up'}
          </button>
        </form>

        <div className="auth-modal__divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="auth-modal__google"
          onClick={handleGoogleSignIn}
        >
          <img
            src="/icons/google-icon.png"
            alt="Google"
            className="auth-modal__google-icon"
          />
          Continue with Google
        </button>

        <div className="auth-modal__switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="auth-modal__switch-btn"
            onClick={handleSwitchMode}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
