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

export interface disable_enable_response {
  user_id: number;
  token: string;
  is_enable: boolean;
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


export async function get_all_users(page: number = 1): Promise<user_model[]> {
  const token = await get_token();
  const response = await fetch(
    `${api_base_url}/user?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_obtener_usuarios');
  }
  return json.data;
}

export async function disable_enable_user(
  user_id: number,
  is_enable: boolean
): Promise<disable_enable_response> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/user/${user_id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id, is_enable }),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_toggle_usuario');
  }

  return json.data;
}

export async function get_profile_walker(page:number = 1): Promise<user_model[]> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/walker_profile/get_profiles?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_perfil_paseador');
  }

  return json.data;
}

export async function see_Request_To_Change(): Promise<user_model[]> {
 const token = await get_token();
 const response = await fetch(`${api_base_url}/walker_profile/requests`, {
   method: 'GET',
   headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
   },
 });
 const json = await response.json();
 if (!response.ok || json.error) {
   throw new Error(json.msg || 'error_al_obtener_solicitudes_de_cambio');
 }
 return json.data;
}


export async function approve_To_Change(walker_id: number) {
 const token = await get_token();
 const response = await fetch(`${api_base_url}/walker_profile/requests/${walker_id}/approve`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
   },
 });
 const json = await response.json();
 if (!response.ok || json.error) {
   throw new Error(json.msg || 'error_al_aprobar_la_solicitud_de_cambio');
 }
 return json.data;
}


export async function see_Request_Details_To_Change(walker_id: number): Promise<user_model> {
 const token = await get_token();
 const response = await fetch(`${api_base_url}/walker_profile/requests_info/${walker_id}`, {
   method: 'GET',
   headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
   },
 });
 const json = await response.json();
 if (!response.ok || json.error) {
   throw new Error(json.msg || 'error_al_obtener_detalles_de_la_solicitud_de_cambio');
 }
 return json.data;
}


export async function reject_To_Change(walker_id: number): Promise<user_model> {
 const token = await get_token();
 const response = await fetch(`${api_base_url}/walker_profile/requests/${walker_id}/reject`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
   },
 });
 const json = await response.json();
 if (!response.ok || json.error) {
   throw new Error(json.msg || 'error_al_rechazar_la_solicitud_de_cambio');
 }
 return json.data;
}


export async function register_Walker(formData: FormData): Promise<any> {
const token = await get_token();
const res = await fetch(`${api_base_url}/walker_profile/register_walker`, {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
const json = await res.json();
if (!res.ok || json.error) {
  throw new Error(json.msg || 'error_al_registrar_paseador');
}
return json.data;
}

export async function get_all_walks(page: number = 1): Promise<any[]> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/walk/?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_obtener_paseos');
  }
  return json.data;
}