import AsyncStorage from '@react-native-async-storage/async-storage';
import { user_model } from '../models/user_model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const save_session = async (token: string, user: user_model): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
  } catch (error) {
    console.error('error_guardando_sesion:', error);
    throw error;
  }
};

export const get_token = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('error_obteniendo_token:', error);
    return null;
  }
};

export const get_user = async (): Promise<user_model | null> => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('error_obteniendo_user:', error);
    return null;
  }
};

export const clear_session = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('error_eliminando_sesion:', error);
  }
};
