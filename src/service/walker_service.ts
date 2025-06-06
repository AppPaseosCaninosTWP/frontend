//Obtiene el token JWT y los datos del usuario autenticado
import { get_token, get_user } from "../utils/token_service";
//Obtiene el modelo de paseador
import type { walker_model } from "../models/walker_model";
import { user_model } from "../models/user_model";

//Obtiene la url de la API
const api_base_url = process.env.EXPO_PUBLIC_API_URL;

//Solicita el perfil del paseador
export async function get_walker_profile(): Promise<walker_model> {
  const token = await get_token();
  const user = await get_user();
  if (!token || !user?.id) {
    throw new Error("Sesión no válida");
  }
  //Se hace una petición GET al endpoint del perfil del paseador
  const response = await fetch(
    `${api_base_url}/walker_profile/get_profile/${user.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, //cabecera de autorización con el token JWT
      },
    }
  );
  //La respuesta se pasa a JSON
  const json = await response.json();
  //Respuesta correcta : 200 OK
  if (!response.ok || json.error) {
    //mensaje de back en caso de error
    throw new Error(json.msg || "Error al obtener perfil del paseador");
  }
  // Si todo esta bien se retorna el objeto walker_model
  return json.data as walker_model;
}

export async function get_profile_walker_by_id(
  walker_id: number
): Promise<user_model> {
  const token = await get_token();
  const response = await fetch(
    `${api_base_url}/walker_profile/get_profile/${walker_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "error_obtener_perfil_paseador_por_id");
  }
  return json.data;
}

export async function get_profile_walker(
  page: number = 1
): Promise<user_model[]> {
  const token = await get_token();
  const response = await fetch(
    `${api_base_url}/walker_profile/get_profiles?page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "error_perfil_paseador");
  }

  return json.data;
}

export async function update_walker_profile(
  form_data: FormData
): Promise<void> {
  const token = await get_token();
  const user = await get_user();
  if (!token || !user?.id) {
    throw new Error("Sesión no válida");
  }

  const response = await fetch(
    `${api_base_url}/walker_profile/update_walker_profile/${user.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form_data,
    }
  );

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al actualizar perfil del paseador");
  }
}
