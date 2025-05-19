import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { get_user } from '../../../utils/token_service';
import { get_user_pets } from '../../../service/pet_service';
import type { pet_model } from '../../../models/pet_model';
import SwipeButtonTWP from '../../../components/swipe_button';
import Header from '../../../components/shared/header';
import ScreenWithMenu from '../../../components/shared/screen_with_menu';
import type { MenuOption } from '../../../components/shared/side_menu';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { clear_session } from '../../../utils/token_service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_UPLOADS_URL = process.env.EXPO_PUBLIC_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;


export default function DashboardClienteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [is_loading, set_is_loading] = useState(true);
  const [user_pets, set_user_pets] = useState<pet_model[]>([]);
  const [active_index, set_active_index] = useState(0);
  const [show_pets, set_show_pets] = useState(false);


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
        const mappedPets = (pets || []).map((pet: any) => ({
          ...pet,
          zone:
            pet.zone === 'norte'
              ? 'norte'
              : pet.zone === 'centro'
              ? 'centro'
              : pet.zone === 'sur'
              ? 'sur'
              : 'centro',
        }));
        set_user_pets(mappedPets);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las mascotas');
      } finally {
        set_is_loading(false);
      }
    };

    fetch_pets();
  }, []);

const menuOptions: MenuOption[] = [
  // Sección: Inicio
  {
    label: 'Dashboard',
    icon: <Feather name="layout" size={20} color="#000c14" />,
    onPress: () => navigation.navigate('DashboardCliente'),
  },

  { label: '__separator__', icon: null, onPress: () => {} },

  // Sección: Mascotas
  {
    label: 'Mascotas',
    icon: <Ionicons name="paw" size={20} color="#000c14" />,
    onPress: () => {},
  },
  {
    label: 'Nueva mascota',
    icon: <Feather name="plus-circle" size={20} color="#000c14" />,
    onPress: () => navigation.navigate('StepBreedScreen'),
  },
  {
    label: show_pets ? 'Ocultar mascotas' : 'Ver mascotas',
    icon: <Feather name={show_pets ? 'chevron-up' : 'chevron-down'} size={20} color="#000c14" />,
    onPress: () => set_show_pets(!show_pets),
    prevent_close: true, // ✅ importante
  },

  ...(show_pets
    ? user_pets.slice(0, 3).map((pet) => ({
        label: pet.name,
        icon: pet.photo
          ? (
              <Image
                source={{ uri: `${API_UPLOADS_URL}/${pet.photo}` }}
                style={{ width: 20, height: 20, borderRadius: 10 }}
              />
            )
          : <Feather name="image" size={20} color="#000c14" />,
        onPress: () => Alert.alert('PetDetailScreen', `Ver perfil de ${pet.name}`),
      }))
    : []),

  { label: '__separator__', icon: null, onPress: () => {} },

  // Funcionalidades
  {
    label: 'Contactos',
    icon: <Ionicons name="search" size={20} color="#000c14" />,
    onPress: () => Alert.alert('Contactos'),
  },
  {
    label: 'Calendario',
    icon: <MaterialIcons name="calendar-today" size={20} color="#000c14" />,
    onPress: () => Alert.alert('Calendario'),
  },

  // Cuenta
  {
    label: 'Cuenta',
    icon: <Ionicons name="person-circle" size={20} color="#000c14" />,
    onPress: () => Alert.alert('Cuenta'),
  },
  {
    label: 'Ajustes',
    icon: <Feather name="settings" size={20} color="#000c14" />,
    onPress: () => Alert.alert('Ajustes'),
  },
  {
    label: 'Cerrar sesión',
    icon: <Feather name="log-out" size={20} color="#000c14" />,
    onPress: () => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: async () => {
              await clear_session();
              navigation.replace('Login');
            },
          },
        ]
      );
    },
  },
];



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
        <Header roleId={3} />
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
    <ScreenWithMenu roleId={3} menuOptions={menuOptions}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.section_title}>Perfiles de mascotas activos </Text>
        <Text style={styles.badge}>{user_pets.length}</Text>
      </View>


      <View style={styles.carousel_container}>
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.round(x / CARD_WIDTH);
            set_active_index(idx);
          }}
        >
          {user_pets.map((pet, i) => {
            console.log('Foto:', pet.photo);
            console.log('URL:', `${API_UPLOADS_URL}/uploads/${pet.photo}`);
            return (
              <View key={i} style={{ width: CARD_WIDTH, marginRight: 12 }}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.pet_card}
                >
                  <View style={styles.pet_info_box}>
                    <Text style={styles.pet_name}>{pet.name}</Text>
                    <Text style={styles.pet_info_text}>
                      {pet.breed || 'Sin raza'} | {pet.zone}
                    </Text>
                  </View>
                  {pet.photo ? (
                    <Image
                      source={{ uri: `${API_UPLOADS_URL}/uploads/${pet.photo}` }}
                      style={styles.pet_image}
                      onError={() => console.log('Error al cargar imagen:', pet.photo)}
                    />
                  ) : (
                    <Feather name="image" size={60} color="#fff" />
                  )}
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.pagination}>
          {user_pets.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === active_index && styles.active_dot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}>
          <Feather name="map" size={40} color="#007BFF" />
          <Text style={styles.card_title}>¿Un Paseo?</Text>
          <Text style={styles.card_text}>
            Agenda un paseo y deja que tu mascota lo disfrute.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../../assets/admin/admin_photo3.png')}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Nutrición</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../../assets/admin/admin_photo1.png')}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Tarjeta de Salud</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../../assets/admin/admin_photo2.png')}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Historial</Text>
        </TouchableOpacity>
      </View>
    </ScreenWithMenu>
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
  center_content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottom_button: {
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
  carousel_container: {
    marginBottom: 24,
  },
  pet_card: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  pet_info_box: {
    flex: 1,
  },
  pet_info_text: {
    color: '#D0E7FF',
    fontSize: 14,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
  pet_name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  active_dot: {
    backgroundColor: '#007BFF',
  },
  grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 40,
},
card: {
  width: '48%',
  backgroundColor: '#e3f2fd',
  borderRadius: 16,
  paddingVertical: 32, // antes: 24
  paddingHorizontal: 12,
  alignItems: 'center',
  marginBottom: 12,
},

card_title: {
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  color: '#111',
  marginTop: 12,
  marginBottom: 6,
},
card_text: {
  fontSize: 12,
  textAlign: 'center',
  color: '#666',
},
icon: {
  width: 130,
  height: 130,
  marginBottom: 12,
  borderRadius: 16,
},

});
