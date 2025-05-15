// src/screens/main/Admin/user_screen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';

interface User {
  id: string;
  name: string;
  rol_id: number;   
  rating: number;
  type: string;
  time: string;
  zone: string;
  avatar: any;
  enabled: boolean;
}

// DATOS DE EJEMPLO, LUEGO SE DEBE HACER UNA PETICIÓN A LA API, ESTO ES SOLO PARA DEMOSTRAR QUE FUNCIONA 
// LA SCREEN COMO CORRESPONDE
const mockUsers: User[] = [
  { id: '1', name: 'Walter White',  rol_id: 2, rating: 0,   type: '—',           time: '--:--', zone: 'Antofagasta - Sur',    avatar: require('../../../assets/user_icon.png'), enabled: true },
  { id: '2', name: 'Shaggy Rogers', rol_id: 3, rating: 4.7, type: 'Paseo Prueba', time: '11:20', zone: 'Antofagasta - Norte', avatar: require('../../../assets/user_icon.png'), enabled: true },
  { id: '3', name: 'Jesse Pinkman', rol_id: 2, rating: 0,   type: '—',           time: '--:--', zone: 'Antofagasta - Centro',  avatar: require('../../../assets/user_icon.png'), enabled: false },
];

export default function UserScreen() {
  const [tab, setTab] = useState<'Clientes' | 'Paseadores'>('Clientes');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockUsers.filter(u => {
    const matchRole =
      (tab === 'Clientes'  && u.rol_id === 2) ||
      (tab === 'Paseadores' && u.rol_id === 3);
    const matchQuery = u.name.toLowerCase().includes(query.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'enabled' && u.enabled) ||
      (filterStatus === 'disabled' && !u.enabled);
    return matchRole && matchQuery && matchStatus;
  });

  const renderItem = ({ item }: { item: User }) => {
    const isOpen = expandedId === item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.enabled ? '#28A745' : '#DC3545' },
              ]}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.name}
              {item.rol_id === 3 && (
                <Text>
                  <Text style={styles.starIcon}>★</Text>
                  <Text style={styles.starValue}> {item.rating.toFixed(1)}</Text>
                </Text>
              )}
            </Text>
            <Text style={styles.meta}>{item.type} | {item.time}</Text>
            <Text style={styles.zone}>{item.zone}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setExpandedId(isOpen ? null : item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name={isOpen ? 'chevron-down' : 'chevron-right'} size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {isOpen && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={[styles.actionText, styles.enableText]}>✓ Habilitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={[styles.actionText, styles.disableText]}>✕ Deshabilitar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Usuarios" />

      <View style={styles.content}>
        {/* Pestañas */}
        <View style={styles.tabBar}>
          {(['Clientes', 'Paseadores'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => { setTab(t); setFilterStatus('all'); }}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Búsqueda + filtro */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilter(prev => !prev)}
          >
            <Feather name="sliders" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Dropdown de filtro */}
        {showFilter && (
          <View style={styles.filterDropdown}>
            {(['all','enabled','disabled'] as const).map(status => (
              <TouchableOpacity
                key={status}
                style={styles.filterOption}
                onPress={() => { setFilterStatus(status); setShowFilter(false); }}
              >
                <Text style={[
                  styles.filterOptionText,
                  filterStatus === status && styles.filterOptionTextActive
                ]}>
                  {status === 'all'
                    ? 'Todos'
                    : status === 'enabled'
                    ? 'Habilitados'
                    : 'Deshabilitados'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Lista */}
        <FlatList
          data={filtered}
          keyExtractor={u => u.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content:   { flex: 1, backgroundColor: '#FFF' },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 75,
    paddingTop: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 75,
    borderRadius: 11,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  tabActive:   { backgroundColor: '#FFDB58' },
  tabText:     { color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#FFF' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#333',
  },

  filterButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0096FF',
  },
  filterDropdown: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextActive: {
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
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
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  starIcon: { fontSize: 14, color: '#FFDB58' },
  starValue: { fontSize: 14, color: '#333' },
  meta: { color: '#666', marginTop: 4 },
  zone: { color: '#666', fontSize: 12, marginTop: 2 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: { fontSize: 14, color: '#666' },
  enableText: { color: '#28A745' },
  disableText: { color: '#DC3545' },
});
