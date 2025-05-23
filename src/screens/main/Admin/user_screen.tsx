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
import {
  get_all_users,
  disable_enable_user,
  getprofilewalker,
} from '../../../service/auth_service';

interface BackendUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  is_enable: boolean;
  role_id: number;
}

interface WalkerProfile {
  walker_id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  walker_type: string;
  zone: string;
  description: string;
  balance: number;
  on_review: boolean;
  photoUrl: string;
}

type Tab = 'Clientes' | 'Paseadores';
type StatusFilter = 'all' | 'enabled' | 'disabled';

export default function UserScreen() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [walkerProfiles, setWalkerProfiles] = useState<WalkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>('Clientes');
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) traer todos los usuarios
        const allUsers = await get_all_users();
        setUsers(allUsers);

        // 2) traer todos los perfiles de paseadores
        const profiles = (await getprofilewalker() as unknown) as WalkerProfile[];
        setWalkerProfiles(profiles);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  const filterByStatus = (enabled: boolean) =>
    filterStatus === 'all'
      ? true
      : filterStatus === 'enabled'
      ? enabled
      : !enabled;

  // lista clientes
  const clients = users
    .filter(u => u.role_id === 3)
    .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter(u => filterByStatus(u.is_enable));

  // lista paseadores
  const walkers = walkerProfiles
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => {
      const usr = users.find(u => u.user_id === p.walker_id);
      return usr ? filterByStatus(usr.is_enable) : true;
    });

  const renderClient = ({ item }: { item: BackendUser }) => {
    const isOpen = expandedId === String(item.user_id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../../assets/user_icon.png')} style={styles.avatar} />
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
          <TouchableOpacity onPress={() => setExpandedId(isOpen ? null : String(item.user_id))}>
            <Feather name={isOpen ? 'chevron-down' : 'chevron-right'} size={20} color="#333" />
          </TouchableOpacity>
        </View>
        {isOpen && (
          <View style={styles.actions}>
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
      </View>
    );
  };

  const renderWalker = ({ item }: { item: WalkerProfile }) => {
    const isOpen = expandedId === String(item.walker_id);
    const usr = users.find(u => u.user_id === item.walker_id);
    const enabled = usr ? usr.is_enable : true;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
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
              <Feather name="star" size={14} color="#FFDB58" style={{ marginLeft: 8 }} />
              <Text style={styles.ratingValue}>0</Text>
            </View>
            {/* experiencia abajo del nombre */}
            <Text style={styles.sub}>Experiencia: {item.experience} años</Text>
            <Text style={styles.sub}>{item.email}</Text>
            <Text style={styles.sub}>{item.phone}</Text>
            <Text style={styles.sub}>Tipo: {item.walker_type}</Text>
            <Text style={styles.sub}>Zona: Antofagasta, {item.zone}</Text>
          </View>
          <TouchableOpacity onPress={() => setExpandedId(isOpen ? null : String(item.walker_id))}>
            <Feather name={isOpen ? 'chevron-down' : 'chevron-right'} size={20} color="#333" />
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
            <Text style={[styles.segmentText, tab === t && styles.segmentTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
              <Text style={[styles.optText, filterStatus === s && styles.optTextActive]}>
                {s === 'all' ? 'Todos' : s === 'enabled' ? 'Habilitados' : 'Deshabilitados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {tab === 'Clientes' ? (
        <FlatList<BackendUser>
          data={clients}
          keyExtractor={item => String(item.user_id)}
          renderItem={renderClient}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList<WalkerProfile>
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
  container:        { flex: 1, backgroundColor: '#FFF' },
  loading:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  segment:          { flexDirection: 'row', backgroundColor: '#E5E5E5', borderRadius: 12, margin: 16, overflow: 'hidden', marginBottom: 8 },
  segmentTab:       { flex: 1, paddingVertical: 8, alignItems: 'center' },
  segmentTabActive: { backgroundColor: '#3B82F6' },
  segmentText:      { fontSize: 14, color: '#555', fontWeight: '600' },
  segmentTextActive:{ color: '#FFF' },

  searchRow:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 4 },
  searchBox:   { flex:1, flexDirection:'row', backgroundColor:'#FFF', borderRadius:12, padding:12, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  searchInput: { flex:1, marginLeft:8, fontSize:16, color:'#333' },
  filterBtn:   { marginLeft:12, backgroundColor:'#0096FF', padding:12, borderRadius:12 },

  dropdown:      { backgroundColor:'#FFF', marginHorizontal:16, borderRadius:8, borderWidth:1, borderColor:'#DDD', overflow:'hidden', marginBottom:8 },
  opt:           { padding:12 },
  optActive:     { backgroundColor:'#0096FF' },
  optText:       { fontSize:14, color:'#333' },
  optTextActive: { color:'#FFF', fontWeight:'600' },

  list:          { paddingHorizontal:16, paddingBottom:24 },
  card:          { backgroundColor:'#FFF', borderRadius:12, padding:12, marginVertical:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:4, elevation:2 },
  cardHeader:    { flexDirection:'row', alignItems:'center' },
  avatarContainer:{ position:'relative', marginRight:12 },
  avatar:         { width:48, height:48, borderRadius:24, backgroundColor:'#EEE' },
  statusDot:      { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, borderWidth:2, borderColor:'#FFF' },

  info:         { flex:1 },
  nameRow:      { flexDirection:'row', alignItems:'center' },
  name:         { fontSize:16, fontWeight:'600', color:'#222' },
  ratingValue:  { marginLeft:4, fontSize:14, color:'#333' },
  sub:          { fontSize:14, color:'#666', marginTop:2 },

  actions:      { flexDirection:'row', justifyContent:'center', marginTop:12 },
  actionButton:{ padding:8 },
  actionText:  { fontSize:14, fontWeight:'600' },
  enableText:  { color:'#28A745' },
  disableText: { color:'#DC3545' },
});
