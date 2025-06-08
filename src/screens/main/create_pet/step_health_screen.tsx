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

export default function Step_health_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();

  const [comments, set_comments] = useState(pet_data.comments || '');
  const [medical_condition, set_medical_condition] = useState(pet_data.medical_condition || '');

  const handle_continue = () => {
    if (comments.length > 250) {
      Alert.alert('Error', 'Los comentarios no deben superar los 250 caracteres.');
      return;
    }

    set_pet_data({
      comments: comments.trim(),
      medical_condition: medical_condition.trim(),
    });

    navigation.navigate('step_confirm_screen');
    console.log('Comentarios guardados:', comments);
  };

  return (
    <View style={styles.container}>
      <CreatePetHeader
        title="Agregar perfil de mascota"
        subtitle="Salud y comentarios"
        step={5}
        on_back_press={() => navigation.goBack()}
      />

      <Text style={styles.label}>Condición médica</Text>
      <TextInput
        placeholder="Alergias, medicamentos, etc."
        value={medical_condition}
        onChangeText={set_medical_condition}
        style={styles.input}
      />

      <Text style={styles.label}>Comentarios adicionales</Text>
      <TextInput
        placeholder="Notas sobre la personalidad o cuidados especiales"
        value={comments}
        onChangeText={set_comments}
        multiline
        numberOfLines={4}
        maxLength={250}
        style={styles.textarea}
      />

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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  textarea: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    height: 100,
  },
  actions: {
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 30,
  },
});
