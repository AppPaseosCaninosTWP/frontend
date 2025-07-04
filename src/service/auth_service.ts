const api_base_url = process.env.EXPO_PUBLIC_API_URL;
import { get_token } from '../utils/token_service';
import {
  login_response_model,
  register_preliminary_response,
} from '../models/auth_response_model';
import { user_model } from '../models/user_model';

/**
 * Inicia sesión y devuelve token + usuario
 */
export async function login_user(email: string, password: string): Promise<login_response_model> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al iniciar sesión");
  }

  const backend_user = json.data.user;

  const adapted_user: user_model = {
    id: backend_user.user_id,
    user_id: backend_user.user_id,
    name: backend_user.name,
    email: backend_user.email,
    phone: backend_user.phone,
    is_enable: backend_user.is_enable ?? true, 
    role_id:
      backend_user.role === "admin"
        ? 1
        : backend_user.role === "walker"
        ? 2
        : 3,
    role_name: backend_user.role,
  };

  return {
    token: json.data.token,
    user: adapted_user,
  };
}


/**
 * Registra al usuario y devuelve datos preliminares
 */
export async function register_user(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirm_password: string
): Promise<register_preliminary_response> {
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

/**
 * Verifica el código ingresado para recuperación
 */
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

/**
 * Solicita envío de código por email
 */
export async function send_code(email: string): Promise<void> {
  const trimmed_email = email.trim();

  const response = await fetch(`${api_base_url}/auth/request_password_reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: trimmed_email }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_envio_codigo');
  }
}

/**
 * Cambia la contraseña tras validar código
 */
export async function reset_password(
  email: string,
  code: string,
  password: string,
  confirm_password: string
): Promise<void> {
  const response = await fetch(`${api_base_url}/auth/reset_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password, confirm_password }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_reset_password');
  }
}

/**
 * Verifica el teléfono del usuario
 * @param token Token de verificación pendiente
 */
export async function verify_phone(token: string, code: string): Promise<void> {
  console.log('Enviando a /verify_phone:', { token, code });
  const response = await fetch(`${api_base_url}/auth/verify_phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pending_verification_token: token,
      code,
    }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al verificar teléfono');
  }
}

