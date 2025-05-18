import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { use_pet_creation } from '../../../context/pet_creation_context';
import CreatePetHeader from '../../../components/create_pet/create_pet_header';
import ContinueButton from '../../../components/shared/continue_button';

export default function StepAgeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [age, set_age] = useState(pet_data.age ? String(pet_data.age) : '');

  const handle_continue = () => {
    const parsed = parseInt(age, 10);

    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Error', 'Ingresa una edad válida mayor a 0.');
      return;
    }

    if (parsed > 20) {
      Alert.alert('Error', 'La edad máxima permitida es 20 años.');
      return;
    }

    set_pet_data({ age: parsed });
    // navigation.navigate('StepHealth');
    console.log('Edad registrada:', parsed);
  };

  return (
    <View style={styles.container}>
      <CreatePetHeader
        title="Agregar perfil de mascota"
        subtitle="Edad"
        step={4}
        on_back_press={() => navigation.goBack()}
      />

      <Text style={styles.label}>¿Cuántos años tiene tu mascota?</Text>

      <TextInput
        placeholder="Edad en años"
        value={age}
        onChangeText={set_age}
        keyboardType="numeric"
        maxLength={2}
        style={styles.input}
      />

      <View style={styles.actions}>
        <ContinueButton on_press={handle_continue} disabled={!age.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
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
    paddingBottom: 30,
  },
});
