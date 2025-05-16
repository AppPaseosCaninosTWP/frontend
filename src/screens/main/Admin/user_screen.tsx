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

const mockUsers: User[] = [
  { id: '1', name: 'Walter White',  rol_id: 2, rating: 0, type: '—',           time: '--:--', zone: 'Antofagasta - Sur',    avatar: require('../../../assets/user_icon.png'), enabled: true },
  { id: '2', name: 'Shaggy Rogers', rol_id: 3, rating: 4.7, type: 'Paseo Prueba', time: '11:20', zone: 'Antofagasta - Norte', avatar: require('../../../assets/user_icon.png'), enabled: true },
  { id: '3', name: 'Jesse Pinkman', rol_id: 2, rating: 0, type: '—',           time: '--:--', zone: 'Antofagasta - Centro',  avatar: require('../../../assets/user_icon.png'), enabled: false },
];

type Tab = 'Clientes' | 'Paseadores';
type StatusFilter = 'all' | 'enabled' | 'disabled';

export default function UserScreen() {
  const [tab, setTab] = useState<Tab>('Clientes');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockUsers.filter(u => {
    const byRole =
      (tab === 'Clientes'  && u.rol_id === 2) ||
      (tab === 'Paseadores' && u.rol_id === 3);
    const byQuery = u.name.toLowerCase().includes(query.toLowerCase());
    const byStatus =
      filterStatus === 'all' ||
      (filterStatus === 'enabled'  && u.enabled) ||
      (filterStatus === 'disabled' && !u.enabled);
    return byRole && byQuery && byStatus;
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
                <Text style={styles.ratingWrapper}>
                  <Feather name="star" size={14} color="#FFDB58" />
                  <Text style={styles.ratingValue}> {item.rating.toFixed(1)}</Text>
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
            <Feather
              name={isOpen ? 'chevron-down' : 'chevron-right'}
              size={20}
              color="#333"
            />
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

      {/* Tabs */}
      <View style={styles.segment}>
        {(['Clientes', 'Paseadores'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[
              styles.segmentTab,
              tab === t && styles.segmentTabActive,
            ]}
            onPress={() => {
              setTab(t);
              setFilterStatus('all');
            }}
          >
            <Text
              style={[
                styles.segmentText,
                tab === t && styles.segmentTextActive,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilter(v => !v)}
        >
          <Feather name="filter" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown */}
      {showFilter && (
        <View style={styles.dropdown}>
          {(['all','enabled','disabled'] as StatusFilter[]).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.opt, filterStatus === status && styles.optActive]}
              onPress={() => {
                setFilterStatus(status);
                setShowFilter(false);
              }}
            >
              <Text
                style={[
                  styles.optText,
                  filterStatus === status && styles.optTextActive,
                ]}
              >
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

      {/* Users List */}
      <FlatList
        data={filtered}
        keyExtractor={u => u.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    marginTop: 12,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentTabActive: {
    backgroundColor: '#3B82F6',
  },
  segmentText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterBtn: {
    marginLeft: 12,
    backgroundColor: '#0096FF',
    padding: 12,
    borderRadius: 12,
  },
  dropdown: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 4,
    overflow: 'hidden',
  },
  opt: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optActive: {
    backgroundColor: '#0096FF',
  },
  optText: {
    fontSize: 14,
    color: '#333',
  },
  optTextActive: {
    color: '#FFF',
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
    shadowOffset: { width: 0, height: 2 },
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  meta: {
    color: '#666',
    marginTop: 4,
  },
  zone: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  enableText: {
    color: '#28A745',
  },
  disableText: {
    color: '#DC3545',
  },
});
