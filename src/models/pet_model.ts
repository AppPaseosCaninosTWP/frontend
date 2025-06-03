export interface pet_model {
  pet_id: number;
  name: string;
  breed: string;
  age: number;
  zone: 'norte' | 'centro' | 'sur';
  description: string;
  comments: string;
  medical_condition: string;
  photo: string;
  owner_id?: number;
  photo_url?: string;
}


  