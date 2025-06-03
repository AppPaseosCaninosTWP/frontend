import { get_token } from '../utils/token_service';
import type { create_walk_payload, walk_model } from '../models/walk_model';

const api_base_url = process.env.EXPO_PUBLIC_API_URL;
const uploads_url = process.env.EXPO_PUBLIC_URL + '/uploads';


export async function create_walk(data: create_walk_payload): Promise<{ walk_id: number }> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/walk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al crear paseo');
  }

  return json; 
}
export async function get_all_walks() {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/walk?ts=${Date.now()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener paseos");
  }

  return json.data || [];
}