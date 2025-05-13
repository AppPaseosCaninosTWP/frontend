import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import HeaderAdminUser from '../../../components/shared/header_admin';

// Datos de ejemplo para los usuarios SOLO PRUEBA despues se reemplaza por la API
const mockUsers = [
  {
    id: '1',
    name: 'Walter White',
    rating: 5,
    type: 'Paseo Fijo',
    time: '11:00',
    zone: 'Antofagasta - Sur',
    avatar: require('../../../assets/user_icon.png'),
    enabled: true,
  },
  {
    id: '2',
    name: 'Shaggy Rogers',
    rating: 4.7,
    type: 'Paseo Prueba',
    time: '11:20',
    zone: 'Antofagasta - Norte',
    avatar: require('../../../assets/user_icon.png'),
    enabled: true,
  },
];

const UserScreen: React.FC = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState<'Clientes' | 'Paseadores'>('Clientes');
  const [query, setQuery] = useState('');

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name}{' '}
            <Text style={styles.star}>★ {item.rating.toFixed(1)}</Text>
          </Text>
          <Text style={styles.meta}>
            {item.type} | {item.time}
          </Text>
          <Text style={styles.zone}>{item.zone}</Text>
        </View>
        <Feather name="chevron-down" size={20} color="#333" />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.actionText, styles.enableText]}>✓ Habilitar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.actionText, styles.disableText]}>✕ Deshabilitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Reemplazamos la barra manual por el header reutilizable */}
      <HeaderAdminUser title="Usuarios" />

      {/* Pestañas */}
      <View style={styles.tabBar}>
        {(['Clientes', 'Paseadores'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Búsqueda + filtro */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Habilitado, Deshabilitado..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={filtered}
        keyExtractor={u => u.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0096FF',
  },
  tabText: {
    color: '#666666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  filterButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0096FF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  star: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0096FF',
  },
  meta: {
    color: '#666666',
    marginTop: 4,
  },
  zone: {
    color: '#666666',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-around',
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  enableText: {
    color: '#28A745',
  },
  disableText: {
    color: '#DC3545',
  },
});
