import { get_token } from "../utils/token_service";
import type { pet_model } from "../models/pet_model";

const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export async function get_user_pets(): Promise<pet_model[]> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/pet`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "error_obtener_mascotas");
  }

  const uploads_url = process.env.EXPO_PUBLIC_URL + "/uploads";

  return (json.data || []).map((pet: pet_model) => ({
    ...pet,
    photo_url: pet.photo ? `${uploads_url}/${pet.photo}` : undefined,
  }));
}

export interface pet_payload {
  name: string | null;
  breed: string | null;
  age: number | null;
  zone: string | null;
  description: string | null;
  comments: string | null;
  medical_condition: string | null;
  photo: string | null;
}

export async function create_pet(pet_data: pet_payload): Promise<pet_model> {
  const token = await get_token();
  const form_data = new FormData();

  form_data.append("name", pet_data.name || "");
  form_data.append("breed", pet_data.breed || "");
  form_data.append("age", String(pet_data.age || 0));
  form_data.append("zone", pet_data.zone || "");
  form_data.append("description", pet_data.description || "");
  form_data.append("comments", pet_data.comments || "");
  form_data.append("medical_condition", pet_data.medical_condition || "");

  if (pet_data.photo && pet_data.photo.startsWith("file://")) {
    const filename = pet_data.photo.split("/").pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    form_data.append("photo", {
      uri: pet_data.photo,
      name: filename,
      type,
    } as any);
  }

  const response = await fetch(`${api_base_url}/pet`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form_data,
  });

  const json = await response.json();
  console.log("respuesta_backend_create_pet:", json);

  if (!response.ok || json.error) {
    throw new Error(json.msg || "error_registrar_mascota");
  }

  return json.data;
}

export async function get_pet_by_id(
  pet_id: number
): Promise<pet_model & { owner: any }> {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  const response = await fetch(`${api_base_url}/pet/${pet_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener la mascota");
  }

  return json.data as pet_model & { owner: any };
}

export async function update_pet(
  pet_id: number,
  data: Partial<pet_model>
): Promise<void> {
  const token = await get_token();
  const res = await fetch(`${api_base_url}/pet/${pet_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || json.error)
    throw new Error(json.msg || "Error al actualizar la mascota");
}

export async function get_assigned_walk_for_pet(
  pet_id: number
): Promise<any | null> {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  const response = await fetch(`${api_base_url}/walk/assigned`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener paseos asignados");
  }

  const walks: any[] = Array.isArray(json.data) ? json.data : [];
  const found = walks.find((w) => w.pet_id === pet_id) || null;
  return found;
}

export async function update_walk_status(
  walk_id: number,
  new_status: "confirmado" | "cancelado"
): Promise<void> {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  const response = await fetch(`${api_base_url}/walk/${walk_id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ new_status }),
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al actualizar estado del paseo");
  }
}
