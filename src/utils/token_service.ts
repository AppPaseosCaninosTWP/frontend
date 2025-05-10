import * as SecureStore from 'expo-secure-store';
import { user_model } from '../models/user_model';

const TOKEN_KEY = 'jwt';
const USER_KEY = 'user';

export const save_session = async (token: string, user: user_model): Promise<void> => {
  if (!token || typeof token !== 'string') {
    throw new Error('El token no es válido o no es string');
  }

  const user_string = JSON.stringify(user);

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, user_string);
};

export const get_token = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const get_user = async (): Promise<user_model | null> => {
  const user_string = await SecureStore.getItemAsync(USER_KEY);
  return user_string ? JSON.parse(user_string) : null;
};

export const clear_session = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};

