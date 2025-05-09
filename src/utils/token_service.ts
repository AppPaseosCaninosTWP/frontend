import * as SecureStore from 'expo-secure-store';

export const save_session = async (token: any, user: any) => {
  console.log('🚨 Token recibido:', token, 'Tipo:', typeof token);
  console.log('🚨 Usuario recibido:', user, 'Tipo:', typeof user);

  if (!token || typeof token !== 'string') {
    throw new Error('❌ El token no es válido o no es string');
  }

  const user_string = JSON.stringify(user);

  await SecureStore.setItemAsync('jwt', token); // debe ser string
  await SecureStore.setItemAsync('user', user_string); // JSON siempre es string
};


export const get_token = async () => {
  return await SecureStore.getItemAsync('jwt');
};

export const get_user = async () => {
  const user_string = await SecureStore.getItemAsync('user');
  return user_string ? JSON.parse(user_string) : null;
};

export const clear_session = async () => {
  await SecureStore.deleteItemAsync('jwt');
  await SecureStore.deleteItemAsync('user');
};
