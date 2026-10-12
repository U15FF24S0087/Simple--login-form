import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, isLoading, authError, logOut } = useAuth();

  if (isLoading) {
    return (
      <main className="page-shell">
        <p className="loading-message" role="status">
          Checking your session...
        </p>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="page-shell">
        <section className="auth-card" aria-labelledby="session-error-title">
          <h1 id="session-error-title">Session unavailable</h1>
          <p className="form-error" role="alert">
            {authError}
          </p>
          <button className="primary-button" onClick={logOut} type="button">
            Return to log in
          </button>
        </section>
      </main>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
