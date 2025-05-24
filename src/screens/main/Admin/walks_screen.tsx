// src/screens/main/Admin/walks_screen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';
import { get_all_walks } from '../../../service/auth_service';

interface APIWalkDay {
  start_date: string;
  start_time: string;
  duration: number;
}

interface APIWalk {
  walk_id: number;
  walk_type: string;
  status: string;
  client_email: string;
  walker_email: string | null;
  days: APIWalkDay[];
}

interface Walk {
  id: string;
  ownerName: string;     // cliente email
  petName: string;       // Esta -- porque no hay mascotas en la data de la API
  date: string;
  status: 'Pendiente' | 'Confirmado' | 'En curso' | 'Finalizado' | 'Cancelado';
  startTime: string;
  endTime: string;
  type: string;
  walker: {
    name: string;
    email: string;
    avatar: any;
    rating: number;
  };
  notes: string;         // placeholder para futuras notas
}

type Filter =
  | 'Todos'
  | 'Pendiente'
  | 'Confirmado'
  | 'En curso'
  | 'Finalizado'
  | 'Cancelado';
const FILTERS: Filter[] = [
  'Todos',
  'Pendiente',
  'Confirmado',
  'En curso',
  'Finalizado',
  'Cancelado',
];

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function WalksScreen() {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<Walk | null>(null);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterdayDate);

  useEffect(() => {
    async function load() {
      try {
        const api = await get_all_walks();
        const walksApi: APIWalk[] = api as unknown as APIWalk[];
        const mapped: Walk[] = walksApi.map(w => {
          const day = w.days[0];
          const d = new Date(day.start_date);
          const date = formatDDMMYYYY(d);
          const [hh, mm] = day.start_time.split(':').map(Number);
          const tot = hh * 60 + mm + day.duration;
          const endH = String(Math.floor(tot / 60) % 24).padStart(2, '0');
          const endM = String(tot % 60).padStart(2, '0');

          let status: Walk['status'];
          switch (w.status) {
            case 'pendiente':   status = 'Pendiente'; break;
            case 'confirmado':  status = 'Confirmado'; break;
            case 'en curso':    status = 'En curso';   break;
            case 'finalizado':  status = 'Finalizado'; break;
            case 'cancelado':   status = 'Cancelado';  break;
            default:
              status = (w.status.charAt(0).toUpperCase() + w.status.slice(1)) as any;
          }

          return {
            id: w.walk_id.toString(),
            ownerName: w.client_email,
            petName: '–',
            date,
            status,
            startTime: day.start_time,
            endTime: `${endH}:${endM}`,
            type: w.walk_type,
            walker: {
              name: w.walker_email ?? 'Sin asignar',
              email: w.walker_email ?? '–',
              avatar: require('../../../assets/user_icon.png'),
              rating: 0,
            },
            notes: '–', 
          };
        });
        setWalks(mapped);
      } catch (err) {
        console.error('Error loading walks:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  const sections = [
    { title: 'Hoy', data: walks.filter(w => w.date === todayKey) },
    { title: 'Ayer', data: walks.filter(w => w.date === yesterdayKey) },
    {
      title: 'Otros días',
      data: walks.filter(w => w.date !== todayKey && w.date !== yesterdayKey),
    },
  ];

  const filtered = sections
    .map(sec => ({
      title: sec.title,
      data: sec.data.filter(w => {
        const q = query.toLowerCase();
        return (
          w.ownerName.toLowerCase().includes(q) &&
          (filter === 'Todos' || w.status === filter)
        );
      }),
    }))
    .filter(sec => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Paseos" />

      {/* buscador + botón filtro */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por dueño..."
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
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.opt, filter === f && styles.optActive]}
              onPress={() => {
                setFilter(f);
                setShowFilter(false);
              }}
            >
              <Text style={[styles.optText, filter === f && styles.optTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SectionList
        sections={filtered}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
            <View style={styles.cardRow}>
              <View style={styles.leftCol}>
                <Image source={item.walker.avatar} style={styles.avatar} />
                <View style={styles.dateBox}>
                  <Feather name="calendar" size={14} color="#666" />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.owner}>{item.ownerName}</Text>
                <Text style={styles.pet}>Mascota · {item.petName}</Text>
              </View>
              <View style={styles.pillCol}>
                <View
                  style={[
                    styles.pill,
                    item.status === 'Pendiente' && styles.pillPending,
                    item.status === 'Confirmado' && styles.pillAccepted,
                    item.status === 'En curso' && styles.pillCourse,
                    item.status === 'Finalizado' && styles.pillDone,
                    item.status === 'Cancelado' && styles.pillCancel,
                  ]}
                >
                  <Text style={styles.pillText}>{item.status}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelected(null)} />
          {selected && (
            <View style={styles.modalContent}>
              <View style={styles.handle} />

              <Text style={styles.modalTitle}>{selected.ownerName}</Text>
              <Text style={styles.modalSub}>Mascota · {selected.petName}</Text>

              <View style={styles.row}>
                <Feather name="calendar" size={16} color="#666" />
                <Text style={[styles.value, { marginLeft: 8 }]}>{selected.date}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Hora inicio</Text>
                  <Text style={styles.value}>{selected.startTime}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Hora término</Text>
                  <Text style={styles.value}>{selected.endTime}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Estado</Text>
                  <Text style={styles.value}>{selected.status}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Tipo paseo</Text>
                  <Text style={styles.value}>{selected.type}</Text>
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 16 }]}>Paseador</Text>
              <View style={styles.walkerCard}>
                <Image source={selected.walker.avatar} style={styles.walkerAvatar} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.walkerName}>{selected.walker.name}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.walkerRating}>{selected.walker.rating.toFixed(1)}</Text>
                    <Feather name="star" size={16} color="#FFDB58" style={{ marginLeft: 6 }} />
                  </View>
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 16 }]}>Notas</Text>
              <Text style={styles.value}>{selected.notes}</Text>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSelected(null)}>
                <Text style={styles.closeButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#FFF' },
  loading:     { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 12 },
  searchBox:   {
    flex: 1, flexDirection: 'row', backgroundColor: '#FFF',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  filterBtn:   { marginLeft: 12, backgroundColor: '#0096FF', padding: 12, borderRadius: 12 },

  dropdown:      { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', marginTop: 4, overflow: 'hidden' },
  opt:           { paddingVertical: 12, paddingHorizontal: 16 },
  optActive:     { backgroundColor: '#0096FF' },
  optText:       { fontSize: 14, color: '#333' },
  optTextActive: { color: '#FFF', fontWeight: '600' },

  sectionHeader: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 24, marginBottom: 8, marginHorizontal: 16 },

  card:    {
    backgroundColor: '#FFF', borderRadius: 12, padding: 12,
    marginHorizontal: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  cardRow:{ flexDirection: 'row', alignItems: 'center' },
  leftCol:{ alignItems: 'center', marginRight: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DDD' },
  dateBox:{ flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dateText:{ marginLeft: 4, fontSize: 12, color: '#666' },
  infoCol:{ flex: 1 },
  owner:  { fontSize: 16, fontWeight: '600', color: '#222' },
  pet:    { fontSize: 14, color: '#555', marginTop: 2 },
  pillCol:{ marginLeft: 'auto' },
  pill:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText:{ fontSize: 12, fontWeight: '600', color: '#FFF' },
  pillPending:  { backgroundColor: '#FBBF24' },
  pillAccepted: { backgroundColor: '#4CAF50' },
  pillCourse:   { backgroundColor: '#00B0FF' },
  pillDone:     { backgroundColor: '#007AFF' },
  pillCancel:   { backgroundColor: '#888' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFF',
    height: '65%',        
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handle:         { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CCC', alignSelf: 'center', marginVertical: 12 },
  modalTitle:     { fontSize: 18, fontWeight: '600', color: '#333' },
  modalSub:       { fontSize: 14, color: '#666', marginBottom: 16 },

  row:            { flexDirection: 'row', marginBottom: 12 },
  col:            { flex: 1 },
  label:          { fontSize: 12, color: '#666' },
  value:          { fontSize: 14, color: '#333', marginTop: 4 },

  walkerCard:    {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8, padding: 12,
    backgroundColor: '#F9F9F9', borderRadius: 8,
  },
  walkerAvatar:  { width: 40, height: 40, borderRadius: 20 },
  walkerName:    { fontSize: 14, fontWeight: '600', color: '#333' },
  sub:           { fontSize: 14, color: '#666', marginTop: 4 },
  ratingRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  walkerRating:  { fontSize: 14, color: '#333' },

  closeButton:    { marginTop: 24, backgroundColor: '#0096FF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  closeButtonText:{ color: '#FFF', fontSize: 16, fontWeight: '600' },
});
