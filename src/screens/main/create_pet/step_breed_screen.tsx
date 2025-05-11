import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { use_pet_creation } from '../../../context/pet_creation_context';
import { breeds } from '../../../data/breeds'; // archivo que te paso abajo
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import CreatePetHeader from '../../../components/create_pet/create_pet_header';

export default function StepBreedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [selected_breed, set_selected_breed] = useState(pet_data.breed);

  const on_continue = () => {
    set_pet_data({ breed: selected_breed });
    navigation.navigate('StepZonaScreen');
  };

  return (
    <View style={styles.container}>
      <CreatePetHeader title="Agregar perfil de mascota" subtitle="Raza" step={1} />


      <FlatList
        data={breeds}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list_container}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.breed_card,
              selected_breed === item.name && styles.breed_card_selected,
            ]}
            onPress={() => set_selected_breed(item.name)}
          >
            <Image source={item.image} style={styles.breed_image} />
            <Text style={styles.breed_name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={on_continue} disabled={!selected_breed} style={[styles.button, !selected_breed && styles.button_disabled]}>
          <Text style={styles.button_text}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('StepZonaScreen')}>
          <Text style={styles.skip_text}>Saltar por ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header_title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',    
  },
  step_info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    textAlign: 'right'
  },
  progress_bar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progress_fill: {
    width: '11.1%',
    height: '100%',
    backgroundColor: '#007BFF',
  },
  list_container: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  breed_card: {
    width: '48%',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  breed_card_selected: {
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  breed_image: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  breed_name: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 10,
  },
  button_disabled: {
    backgroundColor: '#A0CFFF',
  },
  button_text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  skip_text: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

