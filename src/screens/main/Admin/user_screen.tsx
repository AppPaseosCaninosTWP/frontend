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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';
import { get_all_users, disable_enable_user } from '../../../service/auth_service';

interface BackendUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  is_enable: boolean;
  role_id: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  enabled: boolean;
  rol_id: number;
}

type Tab = 'Clientes' | 'Paseadores';
type StatusFilter = 'all' | 'enabled' | 'disabled';

export default function UserScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>('Clientes');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Al montar, cargamos los usuarios desde el backend
  useEffect(() => {
    get_all_users()
      .then((backend: BackendUser[]) => {
        const mapped = backend.map(u => ({
          id: u.user_id.toString(),
          name: u.name,
          email: u.email,
          phone: u.phone,
          enabled: u.is_enable,
          rol_id: u.role_id,
        }));
        setUsers(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  // Filtrar por rol, búsqueda y estado
  const filtered = users.filter(u => {
    const byRole =
      (tab === 'Clientes'  && u.rol_id === 3) ||
      (tab === 'Paseadores' && u.rol_id === 2);
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
            <Image
              source={require('../../../assets/user_icon.png')}
              style={styles.avatar}
            />
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.enabled ? '#28A745' : '#DC3545' },
              ]}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.rol_id === 2 && (
                <>
                  <Feather
                    name="star"
                    size={14}
                    color="#FFDB58"
                    style={{ marginLeft: 8 }}
                  />
                  <Text style={styles.ratingValue}>0</Text>
                </>
              )}
            </View>
            <Text style={styles.sub}>{item.email}</Text>
            <Text style={styles.sub}>{item.phone}</Text>
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                disable_enable_user(Number(item.id), !item.enabled)
                  .then(() => {
                    setUsers(us =>
                      us.map(u =>
                        u.id === item.id ? { ...u, enabled: !u.enabled } : u
                      )
                    );
                  })
                  .catch(console.error);
              }}
            >
              <Text
                style={[
                  styles.actionText,
                  item.enabled ? styles.disableText : styles.enableText,
                ]}
              >
                {item.enabled ? 'Deshabilitar' : 'Habilitar'}
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

      {/* Pestañas */}
      <View style={styles.segment}>
        {(['Clientes', 'Paseadores'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.segmentTab, tab === t && styles.segmentTabActive]}
            onPress={() => {
              setTab(t);
              setFilterStatus('all');
            }}
          >
            <Text
              style={[styles.segmentText, tab === t && styles.segmentTextActive]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buscador + filtro */}
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
                style={[styles.optText, filterStatus === s && styles.optTextActive]}
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
  container:       { flex: 1, backgroundColor: '#FFF' },
  loading:         { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* Tabs */
  segment:           { flexDirection: 'row', backgroundColor: '#E5E5E5', borderRadius: 12, margin: 16, overflow: 'hidden', marginBottom: 8 },
  segmentTab:        { flex: 1, paddingVertical: 8, alignItems: 'center' },
  segmentTabActive:  { backgroundColor: '#3B82F6' },
  segmentText:       { fontSize: 14, color: '#555', fontWeight: '600' },
  segmentTextActive: { color: '#FFF' },

  /* Buscador + filtro */
  searchRow:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 4 },
  searchBox:   { flex:1, flexDirection:'row', backgroundColor:'#FFF', borderRadius:12, padding:12, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  searchInput: { flex:1, marginLeft:8, fontSize:16, color:'#333' },
  filterBtn:   { marginLeft:12, backgroundColor:'#0096FF', padding:12, borderRadius:12 },

  dropdown:      { backgroundColor:'#FFF', marginHorizontal:16, borderRadius:8, borderWidth:1, borderColor:'#DDD', overflow:'hidden', marginBottom:8 },
  opt:           { padding:12 },
  optActive:     { backgroundColor:'#0096FF' },
  optText:       { fontSize:14, color:'#333' },
  optTextActive: { color:'#FFF', fontWeight:'600' },

  /* Lista */
  list:       { paddingHorizontal:16, paddingBottom:24 },
  card:       { backgroundColor:'#FFF', borderRadius:12, padding:12, marginVertical:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:4, elevation:2 },
  cardHeader: { flexDirection:'row', alignItems:'center' },

  /* Avatar + estado */
  avatarContainer: { position:'relative', marginRight:12 },
  avatar:          { width:48, height:48, borderRadius:24 },
  statusDot:       { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, borderWidth:2, borderColor:'#FFF' },

  /* Info */
  info:     { flex:1 },
  nameRow:  { flexDirection:'row', alignItems:'center' },
  name:     { fontSize:16, fontWeight:'600', color:'#222' },
  ratingValue: { fontSize:14, color:'#333', marginLeft:4 },
  sub:      { fontSize:14, color:'#666', marginTop:2 },

  /* Acciones */
  actions:       { flexDirection:'row', justifyContent:'center', marginTop:12 },
  actionButton: { padding:8 },
  actionText:   { fontSize:14, fontWeight:'600' },
  enableText:   { color:'#28A745' },
  disableText:  { color:'#DC3545' },
});
