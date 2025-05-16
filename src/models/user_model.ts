//user_model.ts

export interface user_model {
  id: number;
  user_id: number;
  email: string;
  phone: string;
  role_id: number;
  role_name?: string;
  is_enable: boolean; 
}
