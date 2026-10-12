import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    'Could not connect to the server. Please try again.'
  );
}

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (
      password.length < 8 ||
      new TextEncoder().encode(password).length > 72
    ) {
      setError('Your password must be at least 8 characters and no longer than 72 UTF-8 bytes.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        name: name.trim(),
        email: normalizedEmail,
        password
      });
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Log in with your new account.' }
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="brand-mark" aria-hidden="true">
          S
        </div>
        <h1 id="register-title">Create your account</h1>
        <p className="intro-text">Sign up to get started.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Name</label>
          <input
            autoComplete="name"
            id="name"
            maxLength={80}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
            type="text"
            value={name}
          />

          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            id="email"
            maxLength={254}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              autoComplete="new-password"
              id="password"
              maxLength={72}
              minLength={8}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
