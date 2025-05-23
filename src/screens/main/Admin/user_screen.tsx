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
  get_profile_walker,
} from '../../../service/auth_service';

interface Backend_user {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  is_enable: boolean;
  role_id: number;
}

interface Walker_profile {
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
  photo_url: string;
}

type Tab = 'Clientes' | 'Paseadores';
type Status_filter = 'all' | 'enabled' | 'disabled';

export default function User_screen() {
  const [users, set_users] = useState<Backend_user[]>([]);
  const [walker_profiles, set_walker_profiles] = useState<Walker_profile[]>([]);
  const [loading, set_loading] = useState(true);

  const [tab, set_tab] = useState<Tab>('Clientes');
  const [query, set_query] = useState('');
  const [filter_status, set_filter_status] = useState<Status_filter>('all');
  const [show_filter, set_show_filter] = useState(false);
  const [expanded_id, set_expanded_id] = useState<string | null>(null);

  useEffect(() => {
    async function load_data() {
      try {
        const all_users = await get_all_users();
        set_users(all_users);

        const profiles = (await get_profile_walker() as unknown) as Walker_profile[];
        set_walker_profiles(profiles);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        set_loading(false);
      }
    }
    load_data();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  const filter_by_status = (enabled: boolean) =>
    filter_status === 'all'
      ? true
      : filter_status === 'enabled'
      ? enabled
      : !enabled;

  const clients = users
    .filter(u => u.role_id === 3)
    .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter(u => filter_by_status(u.is_enable));

  const walkers = walker_profiles
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => {
      const usr = users.find(u => u.user_id === p.walker_id);
      return usr ? filter_by_status(usr.is_enable) : true;
    });

  const renderClient = ({ item }: { item: Backend_user }) => {
    const isOpen = expanded_id === String(item.user_id);
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
          <TouchableOpacity onPress={() => set_expanded_id(isOpen ? null : String(item.user_id))}>
            <Feather name={isOpen ? 'chevron-down' : 'chevron-right'} size={20} color="#333" />
          </TouchableOpacity>
        </View>
        {isOpen && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                await disable_enable_user(item.user_id, !item.is_enable);
                set_users(us =>
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

  const render_walker = ({ item }: { item: Walker_profile }) => {
    const isOpen = expanded_id === String(item.walker_id);
    const usr = users.find(u => u.user_id === item.walker_id);
    const enabled = usr ? usr.is_enable : true;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.photo_url }} style={styles.avatar} />
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
          <TouchableOpacity onPress={() => set_expanded_id(isOpen ? null : String(item.walker_id))}>
            <Feather name={isOpen ? 'chevron-down' : 'chevron-right'} size={20} color="#333" />
          </TouchableOpacity>
        </View>
        {isOpen && usr && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                await disable_enable_user(usr.user_id, !usr.is_enable);
                set_users(us =>
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
              set_tab(t);
              set_filter_status('all');
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
            onChangeText={set_query}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => set_show_filter(v => !v)}>
          <Feather name="filter" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {show_filter && (
        <View style={styles.dropdown}>
          {(['all', 'enabled', 'disabled'] as Status_filter[]).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.opt, filter_status === s && styles.optActive]}
              onPress={() => {
                set_filter_status(s);
                set_show_filter(false);
              }}
            >
              <Text style={[styles.optText, filter_status === s && styles.optTextActive]}>
                {s === 'all' ? 'Todos' : s === 'enabled' ? 'Habilitados' : 'Deshabilitados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {tab === 'Clientes' ? (
        <FlatList<Backend_user>
          data={clients}
          keyExtractor={item => String(item.user_id)}
          renderItem={renderClient}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList<Walker_profile>
          data={walkers}
          keyExtractor={item => String(item.walker_id)}
          renderItem={render_walker}
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
