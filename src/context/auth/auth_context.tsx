import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { user_model } from '../../models/user_model';
import {
  get_user,
  get_token,
  save_session,
  clear_session,
  verify_token
} from '../../utils/token_service';

type AuthContextProps = {
  user: user_model | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  auth: (token: string, user: user_model) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextProps);

type AuthState = {
  user: user_model | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
};

type AuthAction =
  | { type: 'auth'; payload: { user: user_model } }
  | { type: 'not-authenticated' }
  | { type: 'logout' };

const auth_reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'auth':
      return {
        ...state,
        user: action.payload.user,
        status: 'authenticated',
      };
    case 'not-authenticated':
    case 'logout':
      return {
        ...state,
        user: null,
        status: 'not-authenticated',
      };
    default:
      return state;
  }
};

const auth_initial_state: AuthState = {
  user: null,
  status: 'checking',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(auth_reducer, auth_initial_state);

  useEffect(() => {
    check_token();
  }, []);

  const check_token = async () => {
    try {
      const token = await get_token();
      const user = await get_user();

      if (!token || !user) {
        return dispatch({ type: 'not-authenticated' });
      }

      const response = await verify_token(token);
      if (!response.success || response.expired) {
        await clear_session();
        return dispatch({ type: 'not-authenticated' });
      }

      dispatch({ type: 'auth', payload: { user } });
    } catch (error) {
      await clear_session();
      dispatch({ type: 'not-authenticated' });
    }
  };

  const auth = async (token: string, user: user_model) => {
    await save_session(token, user);
    dispatch({ type: 'auth', payload: { user } });
  };

  const logout = async () => {
    await clear_session();
    dispatch({ type: 'not-authenticated' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        auth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
