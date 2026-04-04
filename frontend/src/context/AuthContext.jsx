import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext now wraps Clerk hooks so the rest of the app
// (AdminLayout, ProtectedRoute, etc.) works without any changes.
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut } = useClerk();

  // Store token in localStorage so axios interceptor can attach it
  const syncToken = async () => {
    const token = await getToken();
    if (token) localStorage.setItem('adminToken', token);
    else localStorage.removeItem('adminToken');
  };

  // Sync token whenever user changes
  React.useEffect(() => {
    if (isLoaded) syncToken();
  }, [isLoaded, user]);

  const logout = async () => {
    localStorage.removeItem('adminToken');
    await signOut();
  };

  return (
    <AuthContext.Provider value={{
      admin: user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress, name: user.fullName } : null,
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
