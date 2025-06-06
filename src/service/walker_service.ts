//Obtiene el token JWT y los datos del usuario autenticado
import { get_token, get_user } from "../utils/token_service";
//Obtiene el modelo de paseador
import type { walker_model } from "../models/walker_model";

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
