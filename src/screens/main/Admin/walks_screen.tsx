// src/screens/main/Admin/walks_screen.tsx
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

interface Walk {
  id: string;
  ownerName: string;
  petName: string;
  date: string; // "dd.MM.yyyy"
  status: 'En curso' | 'Finalizado' | 'Cancelado';
  zone: string;
  fee: string;
  startTime: string;
  endTime: string;
  type: string;
  walker: {
    name: string;
    avatar: any;
    rating: number;
  };
  notes: string;
}

// Ejemplo de datos; reemplaza con tu fetch real
const mockWalks: Walk[] = [
  {
    id: '1',
    ownerName: 'Shaggy Rogers',
    petName: 'Maxi',
    date: '14.05.2025',
    status: 'En curso',
    zone: 'Antofagasta - Norte',
    fee: '$8.000 CLP',
    startTime: '11:00',
    endTime: '13:00',
    type: 'Fijo',
    walker: {
      name: 'CJ Johnson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.8,
    },
    notes: 'El paseo se realizó sin problemas.',
  },
  {
    id: '2',
    ownerName: 'Walter White',
    petName: 'Gus',
    date: '11.05.2025',
    status: 'Finalizado',
    zone: 'Antofagasta - Sur',
    fee: '$7.500 CLP',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Prueba',
    walker: {
      name: 'Jesse Pinkman',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.5,
    },
    notes: 'Todo bien.',
  },
];

type Filter = 'all' | 'inProgress' | 'finished';
const filterOptions: { key: Filter; label: string }[] = [
  { key: 'all',        label: 'Todos'       },
  { key: 'inProgress', label: 'En curso'    },
  { key: 'finished',   label: 'Finalizados' },
];

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function WalksScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<Walk | null>(null);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterday);

  const sections = [
    { title: 'Hoy',        data: mockWalks.filter(w => w.date === todayKey) },
    { title: 'Ayer',       data: mockWalks.filter(w => w.date === yesterdayKey) },
    { title: 'Otros días', data: mockWalks.filter(w => w.date !== todayKey && w.date !== yesterdayKey) },
  ];

  const filteredSections = sections
    .map(sec => ({
      title: sec.title,
      data: sec.data.filter(w => {
        const mQ = w.ownerName.toLowerCase().includes(query.toLowerCase());
        const mF =
          filter === 'all' ||
          (filter === 'inProgress' && w.status === 'En curso') ||
          (filter === 'finished'  && w.status !== 'En curso');
        return mQ && mF;
      }),
    }))
    .filter(sec => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Paseos" />

      <View style={styles.content}>
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
            onPress={() => setShowFilter(v => !v)}
          >
            <Feather name="sliders" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {showFilter && (
          <View style={styles.filterDropdown}>
            {filterOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.filterOption}
                onPress={() => {
                  setFilter(opt.key);
                  setShowFilter(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  filter === opt.key && styles.filterOptionTextActive
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Lista de paseos */}
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
              <View style={styles.cardRow}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.ownerName}</Text>
                  <Text style={styles.cardSub}>Mascota – {item.petName}</Text>
                  <View style={styles.dateRow}>
                    <Feather name="calendar" size={14} color="#666" />
                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <Text
                    style={[
                      styles.cardStatus,
                      item.status === 'En curso'
                        ? styles.inProgressChip
                        : styles.finishedChip,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom sheet de detalles */}
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
                {/* Handle en la parte superior */}
                <View style={styles.handle} />

                <Text style={styles.modalTitle}>{selected.ownerName}</Text>
                <Text style={styles.modalSub}>Mascota – {selected.petName}</Text>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>Zona</Text>
                    <Text style={styles.value}>{selected.zone}</Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>Monto total</Text>
                    <Text style={styles.value}>{selected.fee}</Text>
                  </View>
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
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.walkerName}>{selected.walker.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.walkerRating}>
                        {selected.walker.rating.toFixed(1)}
                      </Text>
                      <Feather name="star" size={16} color="#FFDB58" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>

                <Text style={[styles.label, { marginTop: 16 }]}>Notas</Text>
                <Text style={styles.value}>{selected.notes}</Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelected(null)}
                >
                  <Text style={styles.closeButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content:   { flex: 1, backgroundColor: '#FFF' },

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
  searchInput: { flex: 1, paddingVertical: 8, color: '#333' },
  filterButton: { marginLeft: 8, padding: 12, borderRadius: 8, backgroundColor: '#0096FF' },

  filterDropdown: {
    position: 'absolute',
    top: 56 + 8 + 48,
    right: 16,
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 8,
    zIndex: 10,
  },
  filterOption: { paddingVertical: 8, paddingHorizontal: 16 },
  filterOptionText: { fontSize: 14, color: '#333' },
  filterOptionTextActive: { fontWeight: '600' },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 4 },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },

  cardMeta: { marginRight: 8 },
  cardStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgressChip: { backgroundColor: '#E0F7EA', color: '#28A745' },
  finishedChip:   { backgroundColor: '#F2F2F2', color: '#666' },

  /* Handle superior */
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  modalSub:   { fontSize: 14, color: '#666', marginBottom: 16 },

  row: { flexDirection: 'row', marginBottom: 12 },
  col:   { flex: 1 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, color: '#333', marginTop: 4 },

  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  walkerAvatar: { width: 40, height: 40, borderRadius: 20 },
  walkerName:   { fontSize: 14, fontWeight: '600', color: '#333' },
  walkerRating: { fontSize: 14, color: '#333' },

  closeButton: {
    marginTop: 24,
    backgroundColor: '#0096FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
