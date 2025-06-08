import { user_model } from '../../models/user_model';

export type AuthState = {
    user: user_model | null;
    status: 'checking' | 'authenticated' | 'not_authenticated';
};

export type AuthAction =
    | { type: 'auth'; payload: { user: user_model } }
    | { type: 'not_authenticated' }
    | { type: 'logout' };

export const auth_initial_state: AuthState = {
    user: null,
    status: 'checking',
};

export const auth_reducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'auth':
            return {
                ...state,
                user: action.payload.user,
                status: 'authenticated',
            };
        case 'not_authenticated':
        case 'logout':
            return {
                ...state,
                user: null,
                status: 'not_authenticated',
            };
        default:
            return state;
    }
};
