/**
 * clerkToken.js
 * 
 * A module-level reference to Clerk's getToken function.
 * This lets api.js fetch a fresh Clerk token on every request
 * without needing React hooks (which can't be used in axios interceptors).
 * 
 * AuthContext calls setTokenGetter() once when it mounts,
 * passing Clerk's getToken function to this module.
 */

let _getToken = async () => null;

export const setTokenGetter = (fn) => {
  _getToken = fn;
};

export const getToken = () => _getToken();
