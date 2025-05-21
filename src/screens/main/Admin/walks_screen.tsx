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
  status: 'Pendiente' | 'Aceptado' | 'En curso' | 'Finalizado' | 'Cancelado';
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

const mockWalks: Walk[] = [
  {
    id: '1',
    ownerName: 'Shaggy Rogers',
    petName: 'Maxi',
    date: '16.05.2025',
    status: 'Pendiente',
    zone: 'Antofagasta – Norte',
    fee: '$8.000 CLP',
    startTime: '11:00',
    endTime: '13:00',
    type: 'Fijo',
    walker: {
      name: 'CJ Johnson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.8,
    },
    notes: 'Preparando paseo.',
  },
  {
    id: '2',
    ownerName: 'Walter White',
    petName: 'Gus',
    date: '17.05.2025',
    status: 'Aceptado',
    zone: 'Antofagasta – Sur',
    fee: '$7.500 CLP',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Prueba',
    walker: {
      name: 'Jesse Pinkman',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.5,
    },
    notes: 'Paseo aceptado.',
  },
  {
    id: '3',
    ownerName: 'Finn Mertens',
    petName: 'BMO',
    date: '15.05.2025',
    status: 'En curso',
    zone: 'Tierra de Ooo',
    fee: '$7.000 CLP',
    startTime: '08:00',
    endTime: '09:00',
    type: 'Esporádico',
    walker: {
      name: 'Rick Sanchez',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.2,
    },
    notes: 'Ruta en proceso.',
  },
  {
    id: '4',
    ownerName: 'Morty Smith',
    petName: 'Snuffles',
    date: '14.05.2025',
    status: 'Finalizado',
    zone: 'Tierra de Ooo',
    fee: '$6.500 CLP',
    startTime: '14:00',
    endTime: '15:00',
    type: 'Esporádico',
    walker: {
      name: 'Beth Smith',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.0,
    },
    notes: 'Paseo completado.',
  },
  {
    id: '5',
    ownerName: 'Rick Sanchez',
    petName: 'MortyBot',
    date: '11.05.2025',
    status: 'Cancelado',
    zone: 'Dimensión C-137',
    fee: '$0 CLP',
    startTime: '–',
    endTime: '–',
    type: 'Fijo',
    walker: {
      name: 'Birdperson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.9,
    },
    notes: 'Cancelado por cliente.',
  },
];

type Filter =
  | 'Todos'
  | 'Pendiente'
  | 'Aceptado'
  | 'En curso'
  | 'Finalizado'
  | 'Cancelado';
const FILTERS: Filter[] = [
  'Todos',
  'Pendiente',
  'Aceptado',
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
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<Walk | null>(null);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterdayDate);

  const sections = [
    {
      title: 'Hoy',
      data: mockWalks.filter(w => w.date === todayKey),
    },
    {
      title: 'Ayer',
      data: mockWalks.filter(w => w.date === yesterdayKey),
    },
    {
      title: 'Otros días',
      data: mockWalks.filter(
        w => w.date !== todayKey && w.date !== yesterdayKey
      ),
    },
  ];

  const filteredSections = sections
    .map(sec => ({
      title: sec.title,
      data: sec.data.filter(w => {
        const matchesQuery = w.ownerName
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesFilter =
          filter === 'Todos' || w.status === filter;
        return matchesQuery && matchesFilter;
      }),
    }))
    .filter(sec => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF"
      />
      <HeaderAdmin title="Paseos" />

      {/* Búsqueda + Botón de filtro */}
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

      {/* Dropdown de filtros */}
      {showFilter && (
        <View style={styles.dropdown}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.opt,
                filter === f && styles.optActive,
              ]}
              onPress={() => {
                setFilter(f);
                setShowFilter(false);
              }}
            >
              <Text
                style={[
                  styles.optText,
                  filter === f && styles.optTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lista seccionada */}
      <SectionList
        sections={filteredSections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <View style={styles.cardRow}>
              <View style={styles.leftCol}>
                <Image
                  source={item.walker.avatar}
                  style={styles.avatar}
                />
                <View style={styles.dateBox}>
                  <Feather
                    name="calendar"
                    size={14}
                    color="#666"
                  />
                  <Text style={styles.dateText}>
                    {item.date}
                  </Text>
                </View>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.owner}>
                  {item.ownerName}
                </Text>
                <Text style={styles.pet}>
                  Mascota · {item.petName}
                </Text>
              </View>
              <View style={styles.pillCol}>
                <View
                  style={[
                    styles.pill,
                    item.status === 'Pendiente' &&
                      styles.pillPending,
                    item.status === 'Aceptado' &&
                      styles.pillAccepted,
                    item.status === 'En curso' &&
                      styles.pillCourse,
                    item.status === 'Finalizado' &&
                      styles.pillDone,
                    item.status === 'Cancelado' &&
                      styles.pillCancel,
                  ]}
                >
                  <Text style={styles.pillText}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom sheet de detalle */}
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
            <View style={styles.modalContent}>
              <View style={styles.handle} />

              <Text style={styles.modalTitle}>
                {selected.ownerName}
              </Text>
              <Text style={styles.modalSub}>
                Mascota · {selected.petName}
              </Text>

              <View style={styles.row}>
                <Feather
                  name="calendar"
                  size={16}
                  color="#666"
                />
                <Text
                  style={[
                    styles.value,
                    { marginLeft: 8 },
                  ]}
                >
                  {selected.date}
                </Text>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Zona</Text>
                  <Text style={styles.value}>
                    {selected.zone}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>
                    Monto
                  </Text>
                  <Text style={styles.value}>
                    {selected.fee}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>
                    Hora inicio
                  </Text>
                  <Text style={styles.value}>
                    {selected.startTime}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>
                    Hora término
                  </Text>
                  <Text style={styles.value}>
                    {selected.endTime}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Estado</Text>
                  <Text style={styles.value}>
                    {selected.status}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Tipo</Text>
                  <Text style={styles.value}>
                    {selected.type}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.label,
                  { marginTop: 16 },
                ]}
              >
                Paseador
              </Text>
              <View style={styles.walkerCard}>
                <Image
                  source={selected.walker.avatar}
                  style={styles.walkerAvatar}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.walkerName}>
                    {selected.walker.name}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.walkerRating}>
                      {selected.walker.rating.toFixed(1)}
                    </Text>
                    <Feather
                      name="star"
                      size={16}
                      color="#FFDB58"
                      style={{ marginLeft: 6 }}
                    />
                  </View>
                </View>
              </View>

              <Text
                style={[
                  styles.label,
                  { marginTop: 16 },
                ]}
              >
                Notas
              </Text>
              <Text style={styles.value}>
                {selected.notes}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.closeButtonText}>
                  Volver
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },

  // Búsqueda + filtro
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

  // Dropdown de filtros
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

  // Encabezados de sección
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },

  // Tarjetas de paseo
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDD',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  infoCol: {
    flex: 1,
  },
  owner: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  pet: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  pillCol: {
    marginLeft: 'auto',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  pillPending: {
    backgroundColor: '#FBBF24',
  },
  pillAccepted: {
    backgroundColor: '#4CAF50',
  },
  pillCourse: {
    backgroundColor: '#00B0FF',
  },
  pillDone: {
    backgroundColor: '#007AFF',
  },
  pillCancel: {
    backgroundColor: '#888',
  },

  // Bottom sheet de detalle
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
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },

  // Filas y columnas de detalle
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  // Tarjeta de paseador en detalle
  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  walkerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  walkerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  walkerRating: {
    fontSize: 14,
    color: '#333',
  },
  // Botón de cerrar detalle
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
