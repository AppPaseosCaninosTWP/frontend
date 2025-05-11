import React, { createContext, useContext, useState } from 'react';

interface PetCreationData {
  breed: string | null;
  zone: string | null;
  name: string | null;
  age: number | null;
  description: string | null;
  comments: string | null;
  medical_condition: string | null;
  photo: string | null;
}

interface PetCreationContextProps {
  pet_data: PetCreationData;
  set_pet_data: (data: Partial<PetCreationData>) => void;
  reset_pet_data: () => void;
}

const default_data: PetCreationData = {
  breed: null,
  zone: null,
  name: null,
  age: null,
  description: null,
  comments: null,
  medical_condition: null,
  photo: null,
};

const PetCreationContext = createContext<PetCreationContextProps | undefined>(undefined);

export const PetCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [pet_data, set_pet_data_state] = useState<PetCreationData>(default_data);

  const set_pet_data = (data: Partial<PetCreationData>) => {
    set_pet_data_state((prev) => ({ ...prev, ...data }));
  };

  const reset_pet_data = () => set_pet_data_state(default_data);

  return (
    <PetCreationContext.Provider value={{ pet_data, set_pet_data, reset_pet_data }}>
      {children}
    </PetCreationContext.Provider>
  );
};

export const use_pet_creation = (): PetCreationContextProps => {
  const context = useContext(PetCreationContext);
  if (!context) {
    throw new Error('use_pet_creation must be used within a PetCreationProvider');
  }
  return context;
};
