import { get_token } from '../utils/token_service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  zone: string;
  description: string;
  comments: string;
  medical_condition: string;
  photo: string;
}

export async function get_user_pets(): Promise<Pet[]> {
  const token = await get_token();

  const response = await fetch(`${API_BASE_URL}/pet`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  console.log('Respuesta del backend (mascotas):', json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al obtener mascotas');
  }

  return json.data || [];
}

export interface PetPayload {
  name: string | null;
  breed: string | null;
  age: number | null;
  zone: string | null;
  description: string | null;
  comments: string | null;
  medical_condition: string | null;
  photo: string | null;
}

export async function create_pet(pet_data: PetPayload): Promise<Pet> {
  const token = await get_token();

  const response = await fetch(`${API_BASE_URL}/pet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pet_data),
  });

  const json = await response.json();
  console.log('Respuesta del backend (create_pet):', json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al registrar mascota');
  }

  return json.data;
}


