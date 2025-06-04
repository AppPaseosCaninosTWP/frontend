export interface walk_model {
  walk_id: number;
  status: 'pendiente' | 'confirmado' | 'cancelado' | string;
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
