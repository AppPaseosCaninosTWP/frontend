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
  const form_data = new FormData();

  form_data.append('name', pet_data.name || '');
  form_data.append('breed', pet_data.breed || '');
  form_data.append('age', String(pet_data.age || 0));
  form_data.append('zone', pet_data.zone || '');
  form_data.append('description', pet_data.description || '');
  form_data.append('comments', pet_data.comments || '');
  form_data.append('medical_condition', pet_data.medical_condition || '');

  if (pet_data.photo && pet_data.photo.startsWith('file://')) {
    const filename = pet_data.photo.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    form_data.append('photo', {
      uri: pet_data.photo,
      name: filename,
      type,
    } as any);
  }

  const response = await fetch(`${API_BASE_URL}/pet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form_data,
  });

  const json = await response.json();
  console.log('Respuesta del backend (create_pet):', json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Error al registrar mascota');
  }

  return json.data;
}
