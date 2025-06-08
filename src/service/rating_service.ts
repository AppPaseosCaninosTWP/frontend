import axios from 'axios'
import { get_token } from '../utils/token_service'

const API_URL = process.env.EXPO_PUBLIC_URL

interface RatingResponse {
  msg: string
  rating: {
    id: number
    walk_id: number
    sender_id: number
    receiver_id: number
    value: number
    comment: string
    created_at?: string
    updated_at?: string
  }
}

interface RatingPayload {
  walk_id: number
  receiver_id: number
  value: number
  comment: string
}


export const create_rating = async (payload: RatingPayload): Promise<void> => {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  try {
    await axios.post(`${API_URL}/api/rating`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error: any) {
    console.error('Error al crear la calificación:', error);
    throw new Error(error.response?.data?.msg || 'Error al enviar la calificación');
  }
}
