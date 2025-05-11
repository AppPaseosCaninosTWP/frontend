export interface pet_model {
    id: number;
    name: string;
    breed: string;
    age: number;
    zone: string;
    description: string;
    comments: string;
    medical_condition: string;
    photo: string;
    user_id?: number; // esta variable se agrega ya que se asume que la mascota pertenece a un usuario
  }
  