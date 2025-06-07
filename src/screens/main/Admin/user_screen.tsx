// src/screens/main/Admin/user_screen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';
import { get_all_users, disable_enable_user } from '../../../service/user_service';
import { get_user_pets, update_pet } from '../../../service/pet_service';
import { API_UPLOADS_URL } from '../../../config/constants';
import type { pet_model } from '../../../models/pet_model';
import type { BackendUser } from '../../../models/user_model';
import type { WalkerProfile } from '../../../models/walker_model';
import { get_profile_walker } from '../../../service/walker_service';

type Tab = 'Clientes' | 'Paseadores';
type StatusFilter = 'all' | 'enabled' | 'disabled';

export default function UserScreen() {
  // —— datos de usuarios y paseadores ——
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [walkerProfiles, setWalkerProfiles] = useState<WalkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // —— estado de UI ——
  const [tab, setTab] = useState<Tab>('Clientes');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // —— nuevo: apertura de pets por usuario ——
  const [petsOpenUser, setPetsOpenUser] = useState<BackendUser | null>(null);
  const [petsByUser, setPetsByUser] = useState<Record<number, pet_model[]>>({});
  const [petsLoading, setPetsLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // usuarios paginados
        let allUsers: BackendUser[] = [];
        let pageU = 1;
        while (true) {
          const batch = await get_all_users(pageU++);
          if (!batch.length) break;
          allUsers.push(...batch);
        }
        setUsers(allUsers);

        // paseadores paginados
        let allWalkers: WalkerProfile[] = [];
        let pageW = 1;
        while (true) {
          const batch = await get_profile_walker(pageW++);
          if (!batch.length) break;
          allWalkers.push(...(batch as unknown as WalkerProfile[]));
        }
        setWalkerProfiles(allWalkers);

      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filterByStatus = (enabled: boolean) =>
    filterStatus === 'all'
      ? true
      : filterStatus === 'enabled'
      ? enabled
      : !enabled;

  // lista de clientes filtrados
  const clients = users
    .filter(u => u.role_id === 3)
    .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter(u => filterByStatus(u.is_enable));

  // lista de paseadores filtrados (igual que antes)
  const walkers = walkerProfiles
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => {
      const usr = users.find(u => u.user_id === p.walker_id);
      return usr ? filterByStatus(usr.is_enable) : true;
    });

  // —— función para abrir/ocultar mascotas de un cliente
  const handleTogglePets = async (user: BackendUser) => {
    // si ya estaba abierto, lo cerramos
    if (petsOpenUser?.user_id === user.user_id) {
      setPetsOpenUser(null);
      return;
    }
    setPetsOpenUser(user);

    // si ya cargamos antes, no recargamos
    if (petsByUser[user.user_id]) return;

    try {
      setPetsLoading(prev => ({ ...prev, [user.user_id]: true }));
      // paginar todas las mascotas
      let allPets: pet_model[] = [];
      let pg = 1;
      while (true) {
        const batch = await get_user_pets(pg++);
        if (!batch.length) break;
        allPets.push(...batch);
      }
      // filtramos por owner_id
      const ownerPets = allPets.filter(p => p.owner_id === user.user_id);
      setPetsByUser(prev => ({
        ...prev,
        [user.user_id]: ownerPets,
      }));
    } catch (err: any) {
      console.error('Error cargando mascotas:', err);
      Alert.alert('Error', err.message || 'No se pudieron cargar mascotas');
    } finally {
      setPetsLoading(prev => ({ ...prev, [user.user_id]: false }));
    }
  };

  // —— habilitar/deshabilitar mascota
  const togglePet = async (pet: pet_model) => {
    try {
      await update_pet(pet.pet_id, { is_enable: !pet.is_enable });
      setPetsByUser(prev => {
        const list = prev[pet.owner_id!] || [];
        return {
          ...prev,
          [pet.owner_id!]: list.map(p =>
            p.pet_id === pet.pet_id ? { ...p, is_enable: !p.is_enable } : p
          ),
        };
      });
    } catch (err: any) {
      console.error('Error actualizando mascota:', err);
      Alert.alert('Error', err.message || 'No se pudo actualizar mascota');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  const renderClient = ({ item }: { item: BackendUser }) => {
    const isOpen = petsOpenUser?.user_id === item.user_id;
    const userPets = petsByUser[item.user_id] || [];
    const loadingPets = petsLoading[item.user_id];

    return (
      <View style={styles.card}>
        {/* cabecera */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/user_icon.png')}
              style={styles.avatar}
            />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.is_enable ? '#28A745' : '#DC3545' },
              ]}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>{item.email}</Text>
            <Text style={styles.sub}>{item.phone}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              setExpandedId(expandedId === String(item.user_id) ? null : String(item.user_id))
            }
          >
            <Feather
              name={expandedId === String(item.user_id) ? 'chevron-down' : 'chevron-right'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* acciones usuario */}
        {expandedId === String(item.user_id) && (
          <View style={styles.actions}>
            {/* ver/ocultar mascotas */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTogglePets(item)}
            >
              <Text style={styles.actionText}>
                {isOpen ? 'Ocultar mascotas' : 'Ver mascotas'}
              </Text>
            </TouchableOpacity>
            {/* habilitar/deshabilitar usuario */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                await disable_enable_user(item.user_id, !item.is_enable);
                setUsers(us =>
                  us.map(u =>
                    u.user_id === item.user_id
                      ? { ...u, is_enable: !u.is_enable }
                      : u
                  )
                );
              }}
            >
              <Text
                style={[
                  styles.actionText,
                  item.is_enable ? styles.disableText : styles.enableText,
                ]}
              >
                {item.is_enable ? 'Deshabilitar' : 'Habilitar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* listado de mascotas */}
        {isOpen && (
          <View style={styles.petsContainer}>
            {loadingPets ? (
              <ActivityIndicator size="small" color="#0096FF" />
            ) : userPets.length === 0 ? (
              <Text style={styles.noPetsText}>No tiene mascotas.</Text>
            ) : (
              userPets.map(pet => (
                <View key={pet.pet_id} style={styles.petRow}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <TouchableOpacity
                    style={styles.petBtn}
                    onPress={() => togglePet(pet)}
                  >
                    <Text
                      style={[
                        styles.petBtnText,
                        pet.is_enable ? styles.disableText : styles.enableText,
                      ]}
                    >
                      {pet.is_enable ? 'Deshabilitar' : 'Habilitar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  const renderWalker = ({ item }: { item: WalkerProfile }) => {
    // ...igual que antes...
    const isOpen = expandedId === String(item.walker_id);
    const usr = users.find(u => u.user_id === item.walker_id);
    const enabled = usr ? usr.is_enable : true;
    const uri = item.photo.startsWith('http')
      ? item.photo
      : `${API_UPLOADS_URL}/api/uploads/${item.photo}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri }} style={styles.avatar} />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: enabled ? '#28A745' : '#DC3545' },
              ]}
            />
          </View>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Feather name="star" size={14} color="#FFDB58" />
            </View>
            <Text style={styles.sub}>Experiencia: {item.experience} años</Text>
            <Text style={styles.sub}>{item.email}</Text>
            <Text style={styles.sub}>{item.phone}</Text>
            <Text style={styles.sub}>Tipo: {item.walker_type}</Text>
            <Text style={styles.sub}>Zona: {item.zone}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              setExpandedId(expandedId === String(item.walker_id) ? null : String(item.walker_id))
            }
          >
            <Feather
              name={expandedId === String(item.walker_id) ? 'chevron-down' : 'chevron-right'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        </View>
        {isOpen && usr && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                await disable_enable_user(usr.user_id, !usr.is_enable);
                setUsers(us =>
                  us.map(u =>
                    u.user_id === usr.user_id
                      ? { ...u, is_enable: !u.is_enable }
                      : u
                  )
                );
              }}
            >
              <Text
                style={[
                  styles.actionText,
                  enabled ? styles.disableText : styles.enableText,
                ]}
              >
                {enabled ? 'Deshabilitar' : 'Habilitar'}
              </Text>
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

      {/* tabs */}
      <View style={styles.segment}>
        {(['Clientes', 'Paseadores'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.segmentTab, tab === t && styles.segmentTabActive]}
            onPress={() => {
              setTab(t);
              setFilterStatus('all');
              setExpandedId(null);
              setPetsOpenUser(null);
            }}
          >
            <Text style={[styles.segmentText, tab === t && styles.segmentTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* buscador + filtro */}
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
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(v => !v)}>
          <Feather name="filter" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      {showFilter && (
        <View style={styles.dropdown}>
          {(['all', 'enabled', 'disabled'] as StatusFilter[]).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.opt, filterStatus === s && styles.optActive]}
              onPress={() => {
                setFilterStatus(s);
                setShowFilter(false);
              }}
            >
              <Text
                style={[
                  styles.optText,
                  filterStatus === s && styles.optTextActive,
                ]}
              >
                {s === 'all'
                  ? 'Todos'
                  : s === 'enabled'
                  ? 'Habilitados'
                  : 'Deshabilitados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* listado */}
      {tab === 'Clientes' ? (
        <FlatList
          data={clients}
          keyExtractor={item => String(item.user_id)}
          renderItem={renderClient}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={walkers}
          keyExtractor={item => String(item.walker_id)}
          renderItem={renderWalker}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  segmentTab: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  segmentTabActive: { backgroundColor: '#3B82F6' },
  segmentText: { fontSize: 14, color: '#555', fontWeight: '600' },
  segmentTextActive: { color: '#FFF' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  filterBtn: { marginLeft: 12, backgroundColor: '#0096FF', padding: 12, borderRadius: 12 },

  dropdown: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    marginBottom: 8,
  },
  opt: { padding: 12 },
  optActive: { backgroundColor: '#0096FF' },
  optText: { fontSize: 14, color: '#333' },
  optTextActive: { color: '#FFF', fontWeight: '600' },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEE' },
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
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  sub: { fontSize: 14, color: '#666', marginTop: 2 },

  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  actionButton: { marginLeft: 12, padding: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: '#0277BD' },
  enableText: { color: '#28A745' },
  disableText: { color: '#DC3545' },

  // —— estilos de mascotas ——
  petsContainer: {
    marginTop: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  noPetsText: { textAlign: 'center', color: '#666' },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  petName: { fontSize: 14, color: '#333' },
  petBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, },
  petBtnText: { fontSize: 14, fontWeight: '600' },
});