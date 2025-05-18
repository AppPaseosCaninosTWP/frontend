// src/screens/paseador/DashboardPaseadorScreen.tsx

import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenWithMenu from '../../../components/shared/screen_with_menu';
import type { MenuOption } from '../../../components/shared/side_menu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20 * 2; 
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;

export default function DashboardPaseadorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [assigned_walks] = useState([
    { pet_name: 'Maxi', zone: 'Antofagasta', time: '11:00', image: require('../../../assets/breeds/golden.png') },
    { pet_name: 'Odie', zone: 'Antofagasta', time: '12:30', image: require('../../../assets/breeds/akita.png') },
    { pet_name: 'Luna', zone: 'Antofagasta', time: '14:00', image: require('../../../assets/breeds/dalmatian.png') },
  ]);

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
      onPress: () => Alert.alert('Calendario'), //momentaneo hasta que se implemente
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
      onPress: () => Alert.alert('Ajustes'), //momentaneo hasta que se implemente
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
      //onSearchPress={() => navigation.navigate('BuscarPaseos')}
    >
      <Text style={styles.section_title}>Tu próximo paseo: {' '}
        <Text style={styles.badge}>{assigned_walks.length}</Text>
        <Text  style={styles.badge}> paseos asignados</Text>
      </Text>

      {/* --- Carrusel de paseos --- */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ 
            paddingLeft: 0,
            paddingRight: 0, 
          }}
        >
          {assigned_walks.map((walk, i) => (
            <View key={i} style={{ width: CARD_WIDTH, marginRight: i < assigned_walks.length - 1 ? 16 : 0 }}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.walk_card}
              >
                <View style={styles.walk_text}>
                  <Text style={styles.pet_name}>{walk.pet_name}</Text>
                  <Text style={styles.detail}>{walk.zone} | {walk.time}</Text>
                </View>
                <Image source={walk.image} style={styles.pet_image} />
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {assigned_walks.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>

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
          //onPress={() => navigation.navigate('MiAgenda')}
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    color: '#D0E7FF',
    fontSize: 14,
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
