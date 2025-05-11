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
import { breeds } from '../../../data/breeds';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

import CreatePetHeader from '../../../components/create_pet/create_pet_header';
import ContinueButton from '../../../components/shared/continue_button';

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
        <ContinueButton on_press={on_continue} disabled={!selected_breed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  list_container: {
    paddingHorizontal: 20,
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
    paddingBottom: 30,
  },
});


