import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    navigate('/login', { replace: true });
  }

  return (
    <main className="page-shell">
      <section className="auth-card dashboard-card" aria-labelledby="dashboard-title">
        <div className="brand-mark" aria-hidden="true">
          S
        </div>
        <p className="eyebrow">YOUR DASHBOARD</p>
        <h1 id="dashboard-title">You&apos;re logged in, {user?.name}!</h1>
        <p className="intro-text">
          Welcome to your account. You are signed in as {user?.email}.
        </p>
        <button className="primary-button" onClick={handleLogOut} type="button">
          Log out
        </button>
      </section>
    </main>
  );
}
