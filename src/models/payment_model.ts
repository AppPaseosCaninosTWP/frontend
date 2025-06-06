export type day_model = {
  start_date: string;
  start_time: string;
  duration: number;
};

export type payment_model = {
  payment_id: number;
  amount: number;
  status: string;
  created_at: string;
  walk?: {
    walker: any;
    pet_name?: string;
    pet_photo?: string;
    days?: day_model[];
  };
};

export interface BalanceResponse {
  walker_id: number;
  walker_name: string;
  balance: number;
  currency?: string;
}

export interface PaymentHistoryItem {
  payment_id: number;
  amount: number;
  date: string;
  status: string; //pendiente o completado
  client_email: string;
}
