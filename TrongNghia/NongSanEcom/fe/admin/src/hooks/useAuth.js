import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    loading,
    updateUser,
  };
}; 