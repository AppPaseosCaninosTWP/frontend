export interface walker_model {
  walker_id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  walker_type: string;
  zone: string;
  description?: string;
  balance: number;
  on_review: boolean;
  photo: string;
  photo_url: string;
}

export interface pending_changes_model {
  experience?: number;
  walker_type?: string;
  zone?: string;
  description?: string;
  photo?: string;
}

export interface walker_profile_with_pending {
  walker_id: number;
  name: string;
  email: string;
  old: {
    experience: number;
    walker_type: string;
    zone: string;
    photo_url: string;
    description?: string;
  };
  pending: pending_changes_model;
}
