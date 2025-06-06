const api_base_url = process.env.EXPO_PUBLIC_API_URL;
import { user_model } from '../models/user_model';
import { get_token } from '../utils/token_service';

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