const api_base_url = process.env.EXPO_PUBLIC_API_URL;
import { user_model } from '../models/user_model';
import { get_token } from '../utils/token_service';
import { disable_enable_response } from '../models/user_model';

export async function get_user_by_id(user_id: number): Promise<user_model> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/user/${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_obtener_usuario_por_id');
  }
  return json.data;
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