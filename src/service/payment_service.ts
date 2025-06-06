import { get_token, get_user } from "../utils/token_service";
import type {
  payment_model,
  BalanceResponse,
  PaymentHistoryItem,
} from "../models/payment_model";

const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export async function get_all_payments(): Promise<payment_model[]> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener pagos");
  }

  return json.data || [];
}

export async function get_payment_by_id(
  payment_id: number
): Promise<payment_model> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment/${payment_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener pago");
  }

  return json.data;
}

export async function update_payment_status(
  payment_id: number,
  new_status: string
): Promise<void> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/payment/${payment_id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_status }),
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al actualizar estado del pago");
  }
}

export async function get_walker_balance(): Promise<BalanceResponse> {
  const token = await get_token();
  const user = await get_user();
  const walker_id = user?.id;

  if (!token || !walker_id) {
    throw new Error("Sesión no válida");
  }

  const response = await fetch(
    `${api_base_url}/walker_profile/get_profile/${walker_id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Balance HTTP ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(json.msg);
  }

  const data = json.data as any;
  return {
    walker_id: data.walker_id,
    walker_name: data.name,
    balance: data.balance,
    currency: "CLP",
  };
}

export async function get_payment_history(): Promise<PaymentHistoryItem[]> {
  const token = await get_token();
  const user = await get_user();
  const walker_id = user?.id;

  if (!token || !walker_id) {
    throw new Error("Sesión no válida");
  }

  const response = await fetch(`${api_base_url}/payment/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`History HTTP ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(json.msg);
  }

  const raw_history: any[] = Array.isArray(json.data) ? json.data : [];

  const mapped_history: PaymentHistoryItem[] = raw_history.map((p) => ({
    payment_id: p.payment_id,
    amount: Number(p.amount),
    date: new Date(p.date).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    status: p.status,
    client_email: p.walk?.client?.email ?? "—",
  }));

  return mapped_history;
}
