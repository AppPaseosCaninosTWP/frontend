export interface walk_model {
  walk_id: number;
  status: 'pendiente' | 'confirmado' | 'cancelado' | string;
  walk_type: string;
  duration: number;
  date: string;      // formato YYYY-MM-DD
  time: string;      // formato HH:mm
  pet_id?: number;
  pet_name?: string;
  pet_photo?: string;
}

