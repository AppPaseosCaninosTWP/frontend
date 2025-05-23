import React, { useState } from 'react';
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';

interface Walker {
  name: string;
  avatar?: any;
  rating?: number;
}

interface Payment {
  id: string;
  owner_name: string;
  pet_name: string;
  date: string;
  payment_status: 'Pagado' | 'Pendiente';
  zone: string;
  fee: string;
  start_time: string;
  end_time: string;
  type: string;
  walker: Walker;
  walk_rating?: number;
  notes: string;
}

const mock_payments: Payment[] = [
  {
    id: '1',
    owner_name: 'Shaggy Rogers',
    pet_name: 'Maxi',
    date: '14.05.2025',
    payment_status: 'Pagado',
    zone: 'Antofagasta - Norte',
    fee: '$8.000 CLP',
    start_time: '11:00',
    end_time: '13:00',
    type: 'Fijo',
    walker: {
      name: 'CJ Johnson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.2,
    },
    walk_rating: 5.0,
    notes: 'El paseador ya recibió su pago.',
  },
  {
    id: '2',
    owner_name: 'Walter White',
    pet_name: 'Gus',
    date: '13.05.2025',
    payment_status: 'Pendiente',
    zone: 'Antofagasta - Sur',
    fee: '$7.500 CLP',
    start_time: '09:00',
    end_time: '10:00',
    type: 'Prueba',
    walker: {
      name: 'Jesse Pinkman',
      avatar: require('../../../assets/user_icon.png'),
      rating: 3.9,
    },
    walk_rating: 4.5,
    notes: 'Queda pendiente el pago al paseador.',
  },
];

type Filter = 'all' | 'paid' | 'pending';

function format_dd_mm_yyyy(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function Payments_screen() {
  const [query, set_query] = useState('');
  const [filter, set_filter] = useState<Filter>('all');
  const [selected_payment, set_selected_payment] = useState<Payment | null>(null);

  const today_key = format_dd_mm_yyyy(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterday_key = format_dd_mm_yyyy(yesterday);

  const sections = [
    { title: 'Hoy', data: mock_payments.filter(p => p.date === today_key) },
    { title: 'Ayer', data: mock_payments.filter(p => p.date === yesterday_key) },
    {
      title: 'Otros días',
      data: mock_payments.filter(p => p.date !== today_key && p.date !== yesterday_key),
    },
  ];

  const filtered_sections = sections
    .map(section => ({
      title: section.title,
      data: section.data.filter(p => {
        const match_query = p.owner_name.toLowerCase().includes(query.toLowerCase());
        const match_filter =
          filter === 'all' ||
          (filter === 'paid' && p.payment_status === 'Pagado') ||
          (filter === 'pending' && p.payment_status === 'Pendiente');
        return match_query && match_filter;
      }),
    }))
    .filter(section => section.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      <HeaderAdmin title="Pagos" />

      {/* filtros */}
      <View style={styles.segmented}>
        {(['all', 'paid', 'pending'] as Filter[]).map(key => (
          <TouchableOpacity
            key={key}
            style={[styles.segment, filter === key && styles.segmentActive]}
            onPress={() => set_filter(key)}
          >
            <Text style={[styles.segmentText, filter === key && styles.segmentTextActive]}>
              {key === 'all' ? 'Todos' : key === 'paid' ? 'Pagados' : 'Pendientes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={set_query}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => set_query('')}>
              <Feather name="x-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* listado */}
      <SectionList
        sections={filtered_sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => set_selected_payment(item)}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.owner_name}</Text>
              <Text style={styles.cardSub}>Mascota – {item.pet_name}</Text>
              <Text style={styles.zoneText}>{item.zone}</Text>
              <View style={styles.row}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.cardMeta}>{item.date}</Text>
                <Feather name="clock" size={14} color="#666" />
                <Text style={styles.cardMeta}>{item.start_time}–{item.end_time}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.pill,
                item.payment_status === 'Pagado' ? styles.pillPaid : styles.pillPending,
              ]}
            >
              {item.payment_status}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* modal */}
      <Modal
        visible={!!selected_payment}
        transparent
        animationType="slide"
        onRequestClose={() => set_selected_payment(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => set_selected_payment(null)} />
          {selected_payment && (
            <View style={styles.modal}>
              <View style={styles.handle} />
              <Text style={styles.modalTitle}>{selected_payment.owner_name}</Text>
              <Text style={styles.modalSub}>Mascota – {selected_payment.pet_name}</Text>
              {/* Más secciones del modal aquí */}
              {/* ... */}
              <TouchableOpacity style={styles.closeBtn} onPress={() => set_selected_payment(null)}>
                <Text style={styles.closeTxt}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const ACCENT = '#0096FF';
const BG = '#F7F7F7';
const CARD = '#FFFFFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  segment: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  segmentActive: { backgroundColor: ACCENT },
  segmentText: { fontSize: 14, color: '#555' },
  segmentTextActive: { color: '#FFF', fontWeight: '600' },

  searchContainer: { marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#333', fontSize: 14 },

  list: { paddingBottom: 24 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#444',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: { flex: 1, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 4 },
  zoneText: { fontSize: 12, color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardMeta: { fontSize: 12, color: '#666', marginLeft: 4, marginRight: 12 },

  pill: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#FFF',
    marginRight: 12,
  },
  pillPaid:    { backgroundColor: '#28A745' },
  pillPending: { backgroundColor: '#9CA3AF' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: CARD,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  modalSub: { fontSize: 14, color: '#555', marginBottom: 16 },
  modalRow: { flexDirection: 'row', marginBottom: 12 },
  modalCol: { flex: 1 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, color: '#333', marginTop: 4 },

  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
  },
  walkerAvatar: { width: 40, height: 40, borderRadius: 20 },
  walkerName: { fontSize: 14, fontWeight: '600', color: '#222' },
  walkerRating: { fontSize: 14, color: '#222' },

  closeBtn: {
    marginTop: 24,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  closeTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
