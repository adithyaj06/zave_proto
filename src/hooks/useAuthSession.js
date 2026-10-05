import { useEffect, useState } from 'react';
import { getCurrentUser, login, logout, register } from '../services/auth';

// Keep session validation and authentication actions out of the app composition component.
const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = async (credentials) => {
    const loggedInUser = await login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const handleRegister = async (credentials) => {
    const registeredUser = await register(credentials);
    setUser(registeredUser);
    return registeredUser;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, authLoading, handleLogin, handleRegister, handleLogout };
};

export default useAuthSession;
