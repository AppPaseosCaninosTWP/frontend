import { user_model } from './user_model';


export interface auth_user_data {
  email: string;
  phone: string;
  user_id: number | null;
}

export interface register_preliminary_response {
  pending_verification_token: string;
  email: string;
  phone: string;
  user_id: number | null;
}


export interface login_response_model {
  token: string;
  user: user_model;
}


export interface reset_password_response {
  msg: string;
  error: boolean;
}
