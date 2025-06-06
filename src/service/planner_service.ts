// src/service/planner_service.ts

import { get_token } from "../utils/token_service";
import type { assigned_walk_model } from "../models/assigned_walk_model";

const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export async function get_assigned_walks(): Promise<assigned_walk_model[]> {
  const token = await get_token();
  if (!token) {
    throw new Error("Token no disponible");
  }

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

  return json.data as assigned_walk_model[];
}
