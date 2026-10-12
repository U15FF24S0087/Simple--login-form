import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem('token'))
  );

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return;
    }

    let isActive = true;

    api
      .get('/auth/me')
      .then(({ data }) => {
        if (isActive) {
          setUser(data.user);
        }
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setAuthError(
            error.response?.data?.message ||
              'Unable to verify your session. Check your connection and try again.'
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  function logIn(token, loggedInUser) {
    localStorage.setItem('token', token);
    setAuthError('');
    setUser(loggedInUser);
  }

  function logOut() {
    localStorage.removeItem('token');
    setAuthError('');
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isLoading, authError, logIn, logOut }),
    [user, isLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
