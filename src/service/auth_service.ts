const api_base_url = process.env.EXPO_PUBLIC_API_URL;
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

export async function login_user(email: string, password: string): Promise<login_response> {
  const response = await fetch(`${api_base_url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  console.log('respuesta_backend_login:', json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_login');
  }

  const token = json.data.token;
  const raw_user = json.data.user?.user ?? json.data.user;

  const user = {
    ...raw_user,
    role_name: raw_user.role || raw_user.role_name,
    name: raw_user.name || '',
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
  const response = await fetch(`${api_base_url}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password, confirm_password }),
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_registro');
  }

  return json.data;
}

export async function verify_reset_code(email: string, code: string): Promise<void> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/user/verify_reset_code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, code }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'codigo_invalido');
  }
}

export async function send_code(email: string): Promise<void> {
  const response = await fetch(`${api_base_url}/auth/request_password_reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_envio_codigo');
  }
}

export async function reset_password(
  email: string,
  code: string,
  password: string,
  confirm_password: string
): Promise<void> {
  const response = await fetch(`${api_base_url}/auth/reset_password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code, password, confirm_password }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_reset_password');
  }
}