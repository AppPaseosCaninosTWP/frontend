// src/service/walk_service.ts
import { get_token } from "../utils/token_service";
import type { create_walk_payload, walk_model } from "../models/walk_model";

const api_base_url = process.env.EXPO_PUBLIC_API_URL;
const uploads_url = process.env.EXPO_PUBLIC_URL + "/uploads";

export async function create_walk(
  data: create_walk_payload
): Promise<{ walk_id: number }> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/walk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al crear paseo");
  }
  return json;
}

export async function get_all_walks(): Promise<walk_model[]> {
  const token = await get_token();
  if (!token) {
    throw new Error('Token no disponible');
  }

  let allWalks: walk_model[] = [];
  let page = 1;

  while (true) {
    const url = `${api_base_url}/walk?page=${page}&ts=${Date.now()}`;
    const response = await fetch(url, {
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
      throw new Error(json.msg || `Error al obtener paseos (página ${page})`);
    }

    const data = Array.isArray(json.data) ? json.data : [];
    if (data.length === 0) {
      break;
    }

    const mapped: walk_model[] = data.map((w: any) => {
      const pet = Array.isArray(w.pets) && w.pets.length > 0 ? w.pets[0] : {};
      const day = Array.isArray(w.days) && w.days.length > 0 ? w.days[0] : {};

      return {
        walk_id: w.walk_id,
        walk_type: w.walk_type,
        status: w.status,
        duration: day.duration,
        date: day.start_date,
        time: day.start_time,
        pet_id: pet.pet_id,
        pet_name: pet.name,
        pet_photo: pet.photo,
        photo_url: pet.photo ? `${uploads_url}/${pet.photo}` : undefined,
        sector: pet.zone ?? undefined,
      };
    });

    allWalks = allWalks.concat(mapped);
    page++;
  }

  return allWalks;
}

export async function get_assigned_walks(): Promise<walk_model[]> {
  const token = await get_token();

  const response = await fetch(`${api_base_url}/walk/assigned`, {
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
    throw new Error(json.msg || "Error al obtener paseos asignados");
  }
  return json.data as walk_model[];
}

export async function get_walk_details(walk_id: number): Promise<any> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/walk/${walk_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'error_obtener_detalles_paseo');
  }
  return json.data;
}