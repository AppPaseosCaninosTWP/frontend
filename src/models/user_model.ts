//user_model.ts

export interface user_model {
  id: any;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  is_enable: boolean;
  role_name?: string;
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