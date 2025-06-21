import axios from "axios";
import { get_token } from "../utils/token_service";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
interface RatingResponse {
  msg: string;
  rating: {
    id: number;
    walk_id: number;
    sender_id: number;
    receiver_id: number;
    value: number;
    comment: string;
    created_at?: string;
    updated_at?: string;
  };
}

interface RatingPayload {
  walk_id: number;
  receiver_id: number;
  value: number;
  comment: string;
}

export interface UserRatingsResponse {
  user_id: number;
  total_items: number;
  average_rating: number;
  ratings: RatingItem[];
}

export interface RatingItem {
  id: number;
  walk_id: number;
  sender_id: number;
  receiver_id: number;
  value: number;
  comment: string;
  created_at: string;
}

export const create_rating = async (payload: RatingPayload): Promise<void> => {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  try {
    await axios.post(`${API_URL}/rating`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    console.error("Error al crear la calificación:", error);
    throw new Error(
      error.response?.data?.msg || "Error al enviar la calificación"
    );
  }
};

export async function get_user_ratings(
  user_id: number
): Promise<UserRatingsResponse> {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  const url = `${API_URL}/rating/user_ratings/${user_id}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.msg);
  return json;
}
