// src/models/walk_model.ts
export interface walk_model {
  walk_id: number;
  status: "pendiente" | "confirmado" | "cancelado" | string;
  walk_type: string;
  duration?: number;
  date?: string;
  time?: string;

  pet_id?: number;
  pet_name?: string;
  pet_photo?: string;
  sector?: string;
  photo_url?: string;

  walker?: {
    email: string;
  };
  client?: {
    email: string;
  };
  comments?: string;
}

export interface create_walk_payload {
  walk_type_id: number;
  pet_ids: number[];
  comments?: string;
  start_time: string;
  duration: number;
  days: string[];
}

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
  pets: {
    pet_id: number;
    name: string;
    photo: string;
    zone: string;
  }[] | null;
}

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
  walker:
    | {
        user_id: number;
        email: string;
        phone: string;
      }
    | null;
  pets: {
    pet_id: number;
    name: string;
    photo: string;
    zone: string;
  }[] | null;
  days: {
    start_date: string;
    start_time: string;
    duration: number;
  }[];
}

export interface DetailedWalk {
  id: string;
  clientName: string;
  walkerName: string;
  walkerAvatar: any;
  petNames: string;
  zone: string;
  date: string;
  status: 'Pendiente' | 'Confirmado' | 'En curso' | 'Finalizado' | 'Cancelado';
  startTime: string;
  endTime: string;
  type: string;
  notes: string;
}