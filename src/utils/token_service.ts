import * as SecureStore from 'expo-secure-store';
import { user_model } from '../models/user_model';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7070';


const token_key = 'jwt';
const user_key = 'user';

export const save_session = async (token: string, user: user_model): Promise<void> => {
  if (!token || typeof token !== 'string') {
    throw new Error('el_token_no_es_valido');
  }

  const role_map: Record<string, number> = {
    admin: 1,
    walker: 2,
    client: 3,
  };

  const role_clean = (user.role_name as string)?.trim().toLowerCase();
  const mapped_role = role_map[role_clean];

  const adapted_user = {
    ...user,
    id: user.user_id,
    role_id: mapped_role ?? -1,
  };

  console.log('usuario_adaptado_con_role_id:', adapted_user);
  console.log('user.role_name:', user.role_name);

  const user_string = JSON.stringify(adapted_user);

  await SecureStore.setItemAsync(token_key, token);
  await SecureStore.setItemAsync(user_key, user_string);
};

export const get_token = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(token_key);
};

export const get_user = async (): Promise<user_model | null> => {
  const user_string = await SecureStore.getItemAsync(user_key);
  return user_string ? JSON.parse(user_string) : null;
};

export const clear_session = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(token_key);
  await SecureStore.deleteItemAsync(user_key);
};

export const verify_token = async (token?: string): Promise<{ success: boolean; expired: boolean }> => {
  try {
    const jwt = token || (await get_token());

    if (!jwt) {
      return { success: false, expired: true };
    }

    const res = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      return { success: false, expired: true };
    }

    const data = await res.json();
    return {
      success: data.success ?? false,
      expired: data.expired ?? true,
    };
  } catch (error) {
    console.error('Error verificando token:', error);
    return { success: false, expired: true };
  }
};

