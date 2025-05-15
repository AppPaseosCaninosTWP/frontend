// src/screens/main/Admin/payments_screen.tsx
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
  avatar?: any;       // avatar opcional
  rating?: number;    // calificación promedio del paseador
}

interface Payment {
  id: string;
  ownerName: string;
  petName: string;
  date: string;           // "dd.MM.yyyy"
  paymentStatus: 'Pagado' | 'Pendiente';
  zone: string;
  fee: string;
  startTime: string;
  endTime: string;
  type: string;
  walker: Walker;
  walkRating?: number;    // calificación del paseo
  notes: string;
}

// Datos de ejemplo: reemplaza por tu fetch real
const mockPayments: Payment[] = [
  {
    id: '1',
    ownerName: 'Shaggy Rogers',
    petName: 'Maxi',
    date: '14.05.2025',
    paymentStatus: 'Pagado',
    zone: 'Antofagasta - Norte',
    fee: '$8.000 CLP',
    startTime: '11:00',
    endTime: '13:00',
    type: 'Fijo',
    walker: {
      name: 'CJ Johnson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.2,
    },
    walkRating: 5.0,
    notes: 'El paseador ya recibió su pago.',
  },
  {
    id: '2',
    ownerName: 'Walter White',
    petName: 'Gus',
    date: '13.05.2025',
    paymentStatus: 'Pendiente',
    zone: 'Antofagasta - Sur',
    fee: '$7.500 CLP',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Prueba',
    walker: {
      name: 'Jesse Pinkman',
      avatar: require('../../../assets/user_icon.png'),
      rating: 3.9,
    },
    walkRating: 4.5,
    notes: 'Queda pendiente el pago al paseador.',
  },
];

type Filter = 'all' | 'paid' | 'pending';

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function PaymentsScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Payment | null>(null);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterday);

  const sections = [
    { title: 'Hoy', data: mockPayments.filter(p => p.date === todayKey) },
    { title: 'Ayer', data: mockPayments.filter(p => p.date === yesterdayKey) },
    {
      title: 'Otros días',
      data: mockPayments.filter(p => p.date !== todayKey && p.date !== yesterdayKey),
    },
  ];

  const filteredSections = sections
    .map(sec => ({
      title: sec.title,
      data: sec.data.filter(p => {
        const matchQuery = p.ownerName
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchFilter =
          filter === 'all' ||
          (filter === 'paid' && p.paymentStatus === 'Pagado') ||
          (filter === 'pending' && p.paymentStatus === 'Pendiente');
        return matchQuery && matchFilter;
      }),
    }))
    .filter(sec => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.container.backgroundColor}
      />
      <HeaderAdmin title="Pagos" />

      <View style={styles.body}>
        {/* --- Filtros arriba de búsqueda --- */}
        <View style={styles.segmented}>
          {(['all', 'paid', 'pending'] as Filter[]).map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.segment, filter === key && styles.segmentActive]}
              onPress={() => setFilter(key)}
            >
              <Text
                style={[
                  styles.segmentText,
                  filter === key && styles.segmentTextActive,
                ]}
              >
                {key === 'all'
                  ? 'Todos'
                  : key === 'paid'
                  ? 'Pagados'
                  : 'Pendientes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Barra de búsqueda --- */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Feather name="x-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- Lista de pagos --- */}
        <SectionList
          sections={filteredSections}
          keyExtractor={item => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelected(item)}
            >
              <View style={styles.cardLeft} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.ownerName}</Text>
                <Text style={styles.cardSub}>Mascota – {item.petName}</Text>
                <View style={styles.row}>
                  <Feather name="calendar" size={14} color="#666" />
                  <Text style={styles.cardMeta}>{item.date}</Text>
                  <Feather name="dollar-sign" size={14} color="#666" />
                  <Text style={styles.cardMeta}>{item.fee}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.status,
                  item.paymentStatus === 'Pagado'
                    ? styles.statusPaid
                    : styles.statusPending,
                ]}
              >
                {item.paymentStatus}
              </Text>
              <Feather name="chevron-right" size={20} color="#AAA" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* --- Modal detalle de pago --- */}
        <Modal
          visible={!!selected}
          transparent
          animationType="slide"
          onRequestClose={() => setSelected(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setSelected(null)}
            />
            {selected && (
              <View style={styles.modal}>
                <View style={styles.handle} />

                <Text style={styles.modalTitle}>{selected.ownerName}</Text>
                <Text style={styles.modalSub}>
                  Mascota – {selected.petName}
                </Text>

                {/* Zona y Calificación del paseo */}
                <View style={styles.modalRow}>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Zona</Text>
                    <Text style={styles.value}>{selected.zone}</Text>
                  </View>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Calificación</Text>
                    <View style={styles.row}>
                      <Text style={styles.value}>
                        {typeof selected.walkRating === 'number'
                          ? selected.walkRating.toFixed(1)
                          : '-'}
                      </Text>
                      <Feather
                        name="star"
                        size={16}
                        color="#FFB300"
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Horario */}
                <View style={styles.modalRow}>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Inicio</Text>
                    <Text style={styles.value}>{selected.startTime}</Text>
                  </View>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Término</Text>
                    <Text style={styles.value}>{selected.endTime}</Text>
                  </View>
                </View>

                {/* Estado / Tipo paseo */}
                <View style={styles.modalRow}>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Pago</Text>
                    <Text style={styles.value}>
                      {selected.paymentStatus}
                    </Text>
                  </View>
                  <View style={styles.modalCol}>
                    <Text style={styles.label}>Tipo paseo</Text>
                    <Text style={styles.value}>{selected.type}</Text>
                  </View>
                </View>

                {/* Fecha */}
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.label}>Fecha</Text>
                  <Text style={styles.value}>{selected.date}</Text>
                </View>

                {/* Paseador */}
                <Text style={[styles.label, { marginTop: 16 }]}>
                  Paseador
                </Text>
                <View style={styles.walkerCard}>
                  {selected.walker.avatar ? (
                    <Image
                      source={selected.walker.avatar}
                      style={styles.walkerAvatar}
                    />
                  ) : (
                    <Feather name="user" size={40} color="#888" />
                  )}
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.walkerName}>
                      {selected.walker.name}
                    </Text>
                    <View style={[styles.row, { marginTop: 4 }]}>
                      <Text style={styles.walkerRating}>
                        {typeof selected.walker.rating === 'number'
                          ? selected.walker.rating.toFixed(1)
                          : '-'}
                      </Text>
                      <Feather
                        name="star"
                        size={16}
                        color="#FFB300"
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Notas */}
                <Text style={[styles.label, { marginTop: 16 }]}>Notas</Text>
                <Text style={styles.value}>{selected.notes}</Text>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelected(null)}
                >
                  <Text style={styles.closeTxt}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 4,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardLeft: { width: 6, backgroundColor: ACCENT, height: '100%' },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardMeta: { fontSize: 12, color: '#666', marginLeft: 4, marginRight: 12 },

  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusPaid:    { backgroundColor: '#E6F4EA', color: '#28A745' },
  statusPending: { backgroundColor: '#F5F5F5', color: '#888' },

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
