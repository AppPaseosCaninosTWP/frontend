import { get_token } from '../utils/token_service';
import type { payment_model } from '../models/payment_model';

const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export async function get_all_payments(): Promise<payment_model[]> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al obtener pagos');
  }

  return json.data || [];
}

export async function get_payment_by_id(payment_id: number): Promise<payment_model> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment/${payment_id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al obtener pago');
  }

  return json.data;
}

export async function update_payment_status(payment_id: number, new_status: string): Promise<void> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment/${payment_id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_status }),
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al actualizar estado del pago');
  }
}