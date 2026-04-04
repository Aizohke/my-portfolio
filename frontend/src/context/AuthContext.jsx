import React, { createContext, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { setTokenGetter } from '../utils/clerkToken';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut } = useClerk();

  // Register Clerk's getToken with the module-level store
  // so axios interceptors can call it without React hooks
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{
      admin: user
        ? { id: user.id, email: user.primaryEmailAddress?.emailAddress, name: user.fullName }
        : null,
      loading: !isLoaded,
      isAuthenticated: !!user,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
