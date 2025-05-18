export interface pet_model {
  id: number;
  name: string;                       // máx. 25 caracteres, obligatorio
  breed: string;                      // opcional, máx. 25 caracteres
  age: number;                        // entre 0 y 20, obligatorio
  zone: 'norte' | 'centro' | 'sur';   // obligatorio, opciones fijas
  description: string;                // obligatorio
  comments: string;                   // opcional, máx. 250 caracteres
  medical_condition: string;          // obligatorio
  photo: string;                      // nombre o URL de la imagen
  owner_id?: number;                  // id del dueño (cliente), opcional en frontend
}

  