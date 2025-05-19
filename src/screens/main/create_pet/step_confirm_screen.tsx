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
import { Feather } from '@expo/vector-icons';
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
      navigation.replace('SuccessScreen');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar mascota');
    } finally {
      set_loading(false);
    }
  };

  const InfoCard = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value?: string | number | null;
  }) =>
    value ? (
      <View style={styles.card}>
        <Feather name={icon} size={20} color="#007BFF" style={styles.card_icon} />
        <View style={styles.card_content}>
          <Text style={styles.card_label}>{label}</Text>
          <Text style={styles.card_value}>{value}</Text>
        </View>
      </View>
    ) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Agregar perfil</Text>

      {pet_data.photo ? (
        <Image source={{ uri: pet_data.photo }} style={styles.image} />
      ) : (
        <View style={styles.placeholder_image} />
      )}

      <Text style={styles.name}>{pet_data.name}</Text>
      <Text style={styles.sub}>{pet_data.breed || 'Raza desconocida'}</Text>

      <View style={styles.section}>
        <Text style={styles.section_title}>Datos importantes</Text>
        <InfoCard icon="calendar" label="Años" value={`${pet_data.age} años`} />
        <InfoCard icon="map-pin" label="Sector de la ciudad" value={pet_data.zone} />
        <InfoCard icon="activity" label="Salud" value={pet_data.medical_condition} />
        <InfoCard icon="message-square" label="Comportamiento" value={pet_data.comments} />
        <InfoCard icon="info" label="Descripción" value={pet_data.description} />
      </View>

      <View style={styles.actions}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <ContinueButton on_press={handle_confirm} text="Añadir a la cuenta" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
    alignSelf: 'center',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
  },
  placeholder_image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  sub: {
    fontSize: 15,
    color: '#888',
    marginBottom: 24,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  section_title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    width: '100%',
  },
  card_icon: {
    marginRight: 12,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_content: {
    flex: 1,
  },
  card_label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  card_value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    marginTop: 30,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});
