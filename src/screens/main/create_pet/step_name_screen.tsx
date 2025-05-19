import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { use_pet_creation } from '../../../context/pet_creation_context';
import CreatePetHeader from '../../../components/create_pet/create_pet_header';
import ContinueButton from '../../../components/shared/continue_button';

export default function StepNameScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [name, set_name] = useState(pet_data.name || '');
  const [photo, set_photo] = useState<string | null>(pet_data.photo || null);

  const pick_image = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      set_photo(selected.uri);
    }
  };

  const handle_continue = () => {
  if (!name.trim()) {
    Alert.alert('Error', 'El nombre es obligatorio.');
    return;
  }

  if (name.length > 25) {
    Alert.alert('Error', 'El nombre no debe superar los 25 caracteres.');
    return;
  }

  set_pet_data({ name: name.trim(), photo });
  navigation.navigate('StepAgeScreen');
};


  return (
    <View style={styles.container}>
      <CreatePetHeader
        title="Agregar perfil de mascota"
        subtitle="Nombre"
        step={3}
        on_back_press={() => navigation.goBack()}
      />

      <TouchableOpacity style={styles.image_picker} onPress={pick_image}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text style={styles.image_placeholder}>📷</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>¿Cómo se llama tu mascota?</Text>

      <TextInput
        placeholder="El nombre de tu mascota"
        value={name}
        onChangeText={set_name}
        maxLength={25}
        style={styles.input}
      />

      <View style={styles.actions}>
        <ContinueButton on_press={handle_continue} disabled={!name.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image_picker: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  image_placeholder: {
    fontSize: 28,
    color: '#999',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  actions: {
    alignItems: 'center',
    marginTop: 30,
  },
});
