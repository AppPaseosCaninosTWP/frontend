import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { use_pet_creation } from '../../../context/pet_creation_context';
import CreatePetHeader from '../../../components/create_pet/create_pet_header';
import ContinueButton from '../../../components/shared/continue_button';

export default function StepAgeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();

  const initial_date = pet_data.age
    ? new Date(new Date().getFullYear() - pet_data.age, 0, 1)
    : new Date(2019, 0, 1);

  const [birth_date, set_birth_date] = useState<Date>(initial_date);
  const [show_picker, set_show_picker] = useState(false);
  const [description, set_description] = useState(pet_data.description || '');

  const calculate_age = (birth: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculate_age(birth_date);

  const handle_continue = () => {
    if (age > 20 || age < 0) {
      Alert.alert('Error', 'La edad debe ser un número válido entre 0 y 20 años.');
      return;
    }

    set_pet_data({
      age,
      description: description.trim(),
    });

    // navigation.navigate('StepHealth');
    console.log('Edad guardada:', age);
  };

  const format_date = (date: Date) =>
    date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <View style={styles.container}>
      <CreatePetHeader
        title="Agregar perfil de mascota"
        subtitle="Datos informativos"
        step={4}
        on_back_press={() => navigation.goBack()}
      />

      {pet_data.photo ? (
        <Image source={{ uri: pet_data.photo }} style={styles.avatar_image} />
      ) : (
        <View style={styles.avatar_circle} />
      )}

      <TouchableOpacity onPress={() => set_show_picker(true)} style={styles.field}>
        <Text style={styles.field_label}>🎂 Cumpleaños</Text>
        <Text style={styles.field_value}>
          {format_date(birth_date)} - {age} años
        </Text>
      </TouchableOpacity>

      {show_picker && (
        <DateTimePicker
          value={birth_date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              set_birth_date(selectedDate);
            }
            set_show_picker(false);
          }}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.textarea}>
        <Text style={styles.textarea_label}>Describe a tu mascota</Text>
        <TextInput
          placeholder="Comportamientos, detalles físicos, etc."
          value={description}
          onChangeText={set_description}
          multiline
          numberOfLines={4}
          style={styles.description_input}
        />
      </View>

      <View style={styles.actions}>
        <ContinueButton on_press={handle_continue} />
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
  avatar_circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAEAEA',
    alignSelf: 'center',
    marginVertical: 20,
  },
  avatar_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  field: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  field_label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  field_value: {
    fontSize: 16,
    fontWeight: '600',
  },
  textarea: {
    marginBottom: 20,
  },
  textarea_label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  description_input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  actions: {
    alignItems: 'center',
    paddingBottom: 30,
  },
});
