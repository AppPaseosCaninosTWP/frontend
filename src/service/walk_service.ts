//WALK SERVICE

//Importa la funcion para obtener el token de autenticación
import { get_token } from "../utils/token_service";
//Importa los tipos de datos necesarios para las funciones
import type { create_walk_payload, walk_model } from "../models/walk_model";

//URL base de la API y URL de uploads
const api_base_url = process.env.EXPO_PUBLIC_API_URL;
const uploads_url = process.env.EXPO_PUBLIC_URL + "/uploads";

//Crea un nuevo paseo en el backend
export async function create_walk(
  data: create_walk_payload
): Promise<{ walk_id: number }> {
  //Obtiene el token de autenticación
  const token = await get_token();

  //Hace peticion POST al endpoint de creación de paseos (backend)
  const response = await fetch(`${api_base_url}/walk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  //Parsea la respuesta JSON
  const json = await response.json();
  //Si hay error se lanza una excepción
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al crear paseo");
  }
  //Retorna la respuesta del servidor
  return json;
}

//Obtiene todos los paseos del backend paginando los resultados
export async function get_all_walks(): Promise<walk_model[]> {
  const token = await get_token();
  if (!token) {
    throw new Error("Token no disponible");
  }

  let allWalks: walk_model[] = [];
  let page = 1;

  //Bucle que itera paginas hasta que la API devuelva una página vacía
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

    //Pasea la respuesta JSON con su error correspondiente
    const json = await response.json();
    if (!response.ok || json.error) {
      throw new Error(json.msg || `Error al obtener paseos (página ${page})`);
    }

    const data = Array.isArray(json.data) ? json.data : [];
    //Si la página está vacía, se sale del bucle
    if (data.length === 0) {
      break;
    }

    //Mapea cada objeto de paseo a un modelo walk_model
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
        photo_url: pet.photo
          ? `${api_base_url}/uploads/${pet.photo}`
          : undefined,
        sector: pet.zone ?? undefined,
      };
    });

    allWalks = allWalks.concat(mapped);
    page++;
  }

  return allWalks;
}

//Obtiene unicamente los paseos asignados al paseador actual
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
  //La API devuelve directamente un array de paseos
  return json.data as walk_model[];
}

//Obtiene los detalles de un paseo específico por su ID
export async function get_walk_details(walk_id: number): Promise<any> {
  const token = await get_token();
  const response = await fetch(`${api_base_url}/walk/${walk_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "error_obtener_detalles_paseo");
  }
  return json.data;
}

//Filtra y devuelve solo los paseos con estado "pendiente" (para el paseador)
export async function get_available_walks(): Promise<walk_model[]> {
  //Obtiene todos los paseos mapeados
  const all = await get_all_walks();
  return all.filter((w) => w.status === "pendiente");
}

//Obtiene el historial de paseos finalizados del paseador
export async function get_walk_history(): Promise<walk_model[]> {
  const token = await get_token();
  if (!token) throw new Error("Token no disponible");

  const response = await fetch(`${api_base_url}/walk/history`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.msg || "Error al obtener historial de paseos");
  }

  //Normaliza la respuesta para obtener un array de paseos
  const raw: any[] = Array.isArray(json.data) ? json.data : [];

  const mapped: walk_model[] = raw.map((w) => {
    const petPhotoUrl: string | undefined = w.pet_photo;

    return {
      walk_id: w.walk_id,
      walk_type: w.walk_type,
      status: w.status,
      duration: w.duration,
      date: w.date,
      time: w.time,
      pet_id: w.pet_id,
      pet_name: w.pet_name,
      photo_url: petPhotoUrl
        ? petPhotoUrl.startsWith("http")
          ? petPhotoUrl
          : `${api_base_url}/uploads/${petPhotoUrl}`
        : undefined,
      sector: w.zone ?? "desconocido",
    };
  });
  return mapped;
}
