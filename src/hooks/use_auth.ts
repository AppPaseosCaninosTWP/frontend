import { useContext } from 'react';
import { AuthContext } from '../context/auth/auth_context';

export function use_auth() {
  const { user, status, auth, logout } = useContext(AuthContext);

  const is_loading = status === 'checking';
  const is_authenticated = status === 'authenticated';

  return {
    user,
    is_loading,
    is_authenticated,
    auth,
    logout,
  };
}
