import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

export interface Walk {
  id: string;
  name: string;
  rating: number;
  type: string;
  time: string;
  zone: string;
  region: string;
  avatar: any;
}

// Datos de ejemplo; luego vendrán de la API
const mockWalks: Walk[] = [
  {
    id: '1',
    name: 'Walter White',
    rating: 5.0,
    type: 'Paseo fijo',
    time: '11:00',
    zone: 'Antofagasta',
    region: 'Sur',
    avatar: require('../../../assets/user_icon.png'),
  },
  {
    id: '2',
    name: 'Shaggy Rogers',
    rating: 4.7,
    type: 'Paseo fijo',
    time: '11:20',
    zone: 'Antofagasta',
    region: 'Norte',
    avatar: require('../../../assets/user_icon.png'),
  },
  {
    id: '3',
    name: 'Finn Mertens',
    rating: 4.0,
    type: 'Paseo de prueba',
    time: '11:22',
    zone: 'Antofagasta',
    region: 'Centro',
    avatar: require('../../../assets/user_icon.png'),
  },
];

export default function AvailableWalksScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = ({ item }: { item: Walk }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PetProfileScreen', { walk: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>
              {item.name}{' '}
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
            </Text>
            <Text style={styles.meta}>
              {item.type} | {item.time}
            </Text>
            <Text style={styles.zone}>
              {item.zone} – {item.region}
            </Text>
          </View>

          <Feather name="chevron-right" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header sencillo con back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paseos disponibles</Text>
      </View>

      <FlatList
        data={mockWalks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export interface Walk {
  id: string;
  name: string;
  rating: number;
  type: string;
  time: string;
  zone: string;
  region: string;
  avatar: any;
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 100,
    color: '#111',
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  star: {
    fontSize: 14,
    color: '#FFDB58',
  },
  ratingValue: {
    fontSize: 14,
    color: '#333',
  },

  meta: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  zone: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});
