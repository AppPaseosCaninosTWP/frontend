import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

import { get_user } from '../../../utils/token_service';
import { get_user_pets } from '../../../service/pet_service';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
import type { pet_model } from '../../../models/pet_model';
import SwipeButtonTWP from '../../../components/swipe_button';
import Header from '../../../components/shared/header';

export default function DashboardClienteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [is_loading, set_is_loading] = useState(true);
  const [user_pets, set_user_pets] = useState<pet_model[]>([]);

  useEffect(() => {
    const fetch_pets = async () => {
      try {
        const user = await get_user();
        if (!user) {
          Alert.alert('Error', 'No se pudo recuperar la sesión');
          navigation.replace('Login');
          return;
        }

        const pets = await get_user_pets();
        set_user_pets(pets || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las mascotas');
      } finally {
        set_is_loading(false);
      }
    };

    fetch_pets();
  }, []);

  if (is_loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (user_pets.length === 0) {
    return (
      <View style={styles.empty_container}>
        <Header role="cliente" />
    
        <View style={styles.center_content}>
          <Image
            source={require('../../../assets/empty_state.png')}
            style={styles.empty_image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Uh Oh!</Text>
          <Text style={styles.subtitle}>
            Parece que no tienes perfiles configurados en este momento, agrega tu mascota ahora
          </Text>
        </View>
    
        <View style={styles.bottom_button}>
          <SwipeButtonTWP
            on_toggle={() => navigation.navigate('StepBreedScreen')}
            text="Desliza para continuar"
            width={300}
            height={80}
          />
        </View>
      </View>
    );
        
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Header role="cliente" />

    <Text style={styles.section_title}>
      Perfiles de mascotas activos <Text style={styles.badge}>{user_pets.length}</Text>
    </Text>

      <View style={styles.pet_card}>
        <Text style={styles.pet_name}>{user_pets[0].name}</Text>
        <Text style={styles.pet_info}>
          {user_pets[0].breed} | {user_pets[0].zone}
        </Text>
        <Image
          source={{ uri: `${API_BASE_URL}/uploads/${user_pets[0].photo}` }}
          style={styles.pet_avatar}
        />
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AgendarPaseo')}
        >
          <Text style={styles.card_title}>¿Un Paseo?</Text>
          <Text style={styles.card_subtitle}>Agenda un paseo y deja que tu mascota lo disfrute.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Nutrición</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Tarjeta de Salud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Historial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  empty_container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header_placeholder: {
    height: 60, // simula el espacio del header (puedes ajustar)
  },
  center_content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  empty_content: {
    alignItems: 'center',
  },
  bottom_button: {
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  empty_image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  section_title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#E6F4FF',
    color: '#007BFF',
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 14,
  },
  pet_card: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  pet_name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  pet_info: {
    color: '#D0E7FF',
    marginBottom: 10,
  },
  pet_avatar: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  card_title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  card_subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});



  