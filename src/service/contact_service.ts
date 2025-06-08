// src/service/contact_service.ts
import { get_token } from "../utils/token_service";
const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export async function get_contact_link_by_user_id(user_id: number): Promise<{
  user_id: number;
  name: string;
  phone: string;
  whatsapp_link: string;
}> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/contact/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || "No se pudo obtener el contacto");
  }

  return json.data;
}
