import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

type AuthMode = 'login' | 'register';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to continue.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Nova Fitness</h1>
        <p>Sign in to manage your workout plans and progress logs.</p>
        <Link to="/" className="guest-link">
          Continue as Guest
        </Link>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-button${mode === 'login' ? ' active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle-button${mode === 'register' ? ' active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
