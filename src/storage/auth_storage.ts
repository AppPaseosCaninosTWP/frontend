import AsyncStorage from '@react-native-async-storage/async-storage';

const token_key = 'auth_token';

export const save_token = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(token_key, token);
  } catch (error) {
    console.error('error_guardando_token:', error);
    throw error;
  }
};

export const get_token = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(token_key);
  } catch (error) {
    console.error('error_obteniendo_token:', error);
    return null;
  }
};

export const remove_token = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(token_key);
  } catch (error) {
    console.error('error_eliminando_token:', error);
  }
};
