const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
import { user_model } from '../models/user_model';
import { get_token } from '../utils/token_service';

export interface login_response {
  token: string;
  user: user_model;
}

export interface register_response {
  email: string;
  phone: string;
  user_id: number;
}
export interface disable_enable_response {
  user_id: number;
  token: string;
  is_enable: boolean;
}

export async function login_user(email: string, password: string): Promise<login_response> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  console.log('Respuesta del backend (login):', json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al iniciar sesión');
  }

  const token = json.data.token;
  const raw_user = json.data.user?.user ?? json.data.user;

  const user = {
    ...raw_user,
    role_name: raw_user.role || raw_user.role_name,
    name: raw_user.name || "",
  };

  return { token, user };
}



export async function register_user(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirm_password: string
): Promise<register_response> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password, confirm_password }),
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al registrarse');
  }

  return json.data;
}


export async function verify_reset_code(email: string, code: string): Promise<void> {
  const token = await get_token();

  const response = await fetch(`${API_BASE_URL}/user/verify_reset_code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, code }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Código inválido');
  }
}

export async function send_code(email: string): Promise<void> {
  const token = await get_token();

  const response = await fetch(`${API_BASE_URL}/user/request_reset_code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al enviar el código');
  }
}

export async function get_all_users(): Promise<user_model[]> {
  const token = await get_token();
  const response = await fetch(`${API_BASE_URL}/user/get_all_user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al obtener los usuarios');
  }
  return json.data;
}

export async function disable_enable_user(
  user_id: number,
  is_enable: boolean
): Promise<disable_enable_response> {
  const token = await get_token();
  const response = await fetch(`${API_BASE_URL}/user/is_enable`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id, is_enable }),
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al deshabilitar/habilitar el usuario');
  }
  return json.data;
}