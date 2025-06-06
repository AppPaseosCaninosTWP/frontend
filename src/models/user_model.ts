//user_model.ts

export interface user_model {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  role_name?: string;
  is_enable: boolean; 
}

export interface BackendUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  is_enable: boolean;
  role_id: number;
}

export interface disable_enable_response {
  user_id: number;
  token: string;
  is_enable: boolean;
}