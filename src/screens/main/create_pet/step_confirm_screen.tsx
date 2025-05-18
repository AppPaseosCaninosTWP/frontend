import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { use_pet_creation } from '../../../context/pet_creation_context';
import ContinueButton from '../../../components/shared/continue_button';
import { create_pet } from '../../../service/pet_service';

export default function StepConfirmScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, reset_pet_data } = use_pet_creation();
  const [loading, set_loading] = useState(false);

  const handle_confirm = async () => {
    set_loading(true);
    try {
      await create_pet(pet_data);
      reset_pet_data();
      navigation.reset({
        index: 0,
        routes: [{ name: 'DashboardCliente' }],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar mascota');
    } finally {
      set_loading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pet_data.photo && (
        <Image source={{ uri: pet_data.photo }} style={styles.image} />
      )}

      <Text style={styles.name}>{pet_data.name}</Text>

      <View style={styles.detail}>
        <Text style={styles.label}>Edad:</Text>
        <Text>{pet_data.age} años</Text>
      </View>

      <View style={styles.detail}>
        <Text style={styles.label}>Raza:</Text>
        <Text>{pet_data.breed || 'No especificada'}</Text>
      </View>

      <View style={styles.detail}>
        <Text style={styles.label}>Zona:</Text>
        <Text>{pet_data.zone}</Text>
      </View>

      {pet_data.description ? (
        <View style={styles.detail}>
          <Text style={styles.label}>Descripción:</Text>
          <Text>{pet_data.description}</Text>
        </View>
      ) : null}

      {pet_data.comments ? (
        <View style={styles.detail}>
          <Text style={styles.label}>Comentarios:</Text>
          <Text>{pet_data.comments}</Text>
        </View>
      ) : null}

      {pet_data.medical_condition ? (
        <View style={styles.detail}>
          <Text style={styles.label}>Condición médica:</Text>
          <Text>{pet_data.medical_condition}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <ContinueButton on_press={handle_confirm} text="Registrar mascota" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  detail: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#444',
  },
  actions: {
    marginTop: 30,
    marginBottom: 40,
  },
});
