export type walk_model = {
  walk_id: number;
  walk_type: string;
  status: string;
  duration: number;
  date: string;
  time: string;
  pet_id: number;
  pet_name: string;
  pet_photo?: string;
  photo_url?: string;
  sector?: string;

  walker?: {
    user_id: number;
    name: string;
    phone: string;
  };
};

//Payload esperado al crear un nuevo paseo
export interface create_walk_payload {
  walk_type_id: number;
  pet_ids: number[];
  comments?: string;
  start_time: string;
  duration: number;
  days: string[];
}

//Estructura cruda de la API para listado de paseos
export interface APIWalkFromList {
  walk_id: number;
  walk_type: string;
  status: string;
  client_email: string;
  walker_email: string | null;
  days: {
    start_date: string;
    start_time: string;
    duration: number;
  }[];
  pets:
    | {
        pet_id: number;
        name: string;
        photo: string;
        zone: string;
      }[]
    | null;
}

//Estructura cruda de la API para detalles de un paseo
export interface APIWalkFromDetail {
  walk_id: number;
  walk_type:
    | string
    | {
        walk_type_id: number;
        name: string;
      };
  status: string;
  comments: string | null;
  client: {
    user_id: number;
    email: string;
    phone: string;
  };
  walker: {
    user_id: number;
    email: string;
    phone: string;
  } | null;
  pets:
    | {
        pet_id: number;
        name: string;
        photo: string;
        zone: string;
      }[]
    | null;
  days: {
    start_date: string;
    start_time: string;
    duration: number;
  }[];
}

//Modelo para los detalles de un paseo
export interface DetailedWalk {
  id: string;
  clientName: string;
  walkerName: string;
  walkerAvatar: any;
  petNames: string;
  zone: string;
  date: string;
  status: "Pendiente" | "Confirmado" | "En curso" | "Finalizado" | "Cancelado";
  startTime: string;
  endTime: string;
  type: string;
  notes: string;
}
