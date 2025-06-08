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

export default function Step_breed_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [selected_breed, set_selected_breed] = useState(pet_data.breed);

  const handle_continue = () => {
    set_pet_data({ breed: selected_breed });
    navigation.navigate('step_zona_screen');
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
        renderItem={({ item }) => {
  const is_selected = selected_breed === item.name;
  return (
    <TouchableOpacity
      style={[
        styles.breed_card,
        is_selected && styles.breed_card_selected,
      ]}
      onPress={() => set_selected_breed(item.name)}
    >
      <View style={styles.image_wrapper}>
        <Image source={item.image} style={styles.breed_image} resizeMode="contain" />
      </View>
      <Text style={[styles.breed_name, is_selected && styles.breed_name_selected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}}

      />

      <View style={styles.actions}>
        <ContinueButton on_press={handle_continue} disabled={!selected_breed} />
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
  list_container: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breed_card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  breed_card_selected: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  image_wrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  breed_image: {
    width: 120,
    height: 120,
  },
  breed_name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    maxWidth: 120,
    lineHeight: 20,
    marginTop: 4,
  },
  breed_name_selected: {
    color: '#007BFF',
  },
  actions: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
});