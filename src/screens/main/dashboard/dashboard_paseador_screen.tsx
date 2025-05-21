import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { LinearGradient } from 'expo-linear-gradient';
import { get_token } from '../../../utils/token_service';

import ScreenWithMenu from '../../../components/shared/screen_with_menu';
import type { MenuOption } from '../../../components/shared/side_menu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20 * 2; 
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;


interface AssignedWalk {
  walk_id:   number;
  pet_id:    number;
  pet_name:  string;
  pet_photo: string;
  zone:      string;
  time:      string;
  date:      string;
}


export default function DashboardPaseadorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [assignedWalks, setAssignedWalks] = useState<AssignedWalk[]>([]);
  const [loading,        setLoading]        = useState(false);
  const isFocused = useIsFocused();

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data, error, msg } = await res.json();
      if (error) throw new Error(msg);
      setAssignedWalks(data);
    } catch (err: any) {
      Alert.alert("Error al cargar paseos", err.message);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (isFocused) fetchAssigned();
}, [isFocused]);


const menuOptions: MenuOption[] = [
    {
      label: 'Dashboard',
      icon: <Feather name="layout" size={20} color="#000c14" />, 
      onPress: () => navigation.navigate('DashboardPaseador'),
    },
    {
      label: 'Buscar Paseos',
      icon: <Ionicons name="search" size={20} color="#000c14" />,
      onPress: () => navigation.navigate('AvailableWalksScreen'),
    },
    {
      label: 'Calendario',
      icon: <MaterialIcons name="calendar-today" size={20} color="#000c14" />,
      onPress: () => Alert.alert('Calendario'), //en mantenimiento hasta que se implemente :D
    },
    { label: '__separator__', icon: null, onPress: () => {} },
    {
      label: 'Cuenta',
      icon: <Ionicons name="person-circle" size={20} color="#000c14" />,
      onPress: () => navigation.navigate('WalkerProfileScreen'),
    },
    {
      label: 'Calificaciones',
      icon: <Ionicons name="star" size={20} color="#000c14" />,
      onPress: () => navigation.navigate('RatingsScreen'),
    },
    {
      label: 'Ajustes',
      icon: <Feather name="settings" size={20} color="#000c14" />,
      onPress: () => Alert.alert('Ajustes'), //en mantenimiento hasta que se implemente :D
    },
  ];


  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CARD_WIDTH);
    setActiveIndex(idx);
  };

  return (
    <ScreenWithMenu
      roleId={2}
      menuOptions={menuOptions}
    >
      <Text style={styles.section_title}>
        Tu próximo paseo:{' '}
        <Text style={styles.badge}>{assignedWalks.length}</Text>{' '}
        paseo(s) asignado(s)
      </Text>

      {/*El carrusel*/}
      { loading? <ActivityIndicator style={{ marginTop: 20 }} />
      :(
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {assignedWalks.map((w, i) => (
          <View
            key={w.walk_id}
            style={{ width: CARD_WIDTH, marginRight: i < assignedWalks.length - 1 ? 16 : 0, }}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.walk_card}
            >
              <View style={styles.walk_text}>
                <Text style={styles.pet_name}>{w.pet_name}</Text>
                <Text style={styles.detail}>
                  {w.zone} | {w.time}
                </Text>
              </View>
              {w.pet_photo
                ? <Image
                    source={{ uri: `${API_BASE_URL}/uploads/${w.pet_photo}` }}
                    style={styles.pet_image}
                  />
                : <Feather name="user" size={80} color="#fff" style={{ marginLeft: 12 }} />
              }
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {assignedWalks.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, idx === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  )
}


      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AvailableWalksScreen')}
        >
          <Feather name="search" size={40} color="#007BFF" />
          <Text style={styles.card_title}>Buscar Paseos</Text>
          <Text style={styles.card_text}>
            Explora paseos publicados por clientes y acepta los que se adapten a tu zona y disponibilidad.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PlannerScreen')}
        >
          <Image
            source={require('../../../assets/plate_icon.png')}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Mi Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('RatingsScreen')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo1.png')}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Calificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WalkHistoryScreen')}
        >
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
  section_title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#E6F4FF',
    color: '#007BFF',
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
  },

  carouselContainer: {
    marginBottom: 24,
  },
  walk_card: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  walk_text: {
    flex: 1,
  },
  pet_name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    color: '#D0E7FF',
    fontSize: 18,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
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
  activeDot: {
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
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  card_title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111',
    marginBottom: 8,
  },
  card_text: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
});
