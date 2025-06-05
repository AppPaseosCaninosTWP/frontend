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
import {
  get_all_walks,
  get_walk_details,
  get_user_by_id,
  get_profile_walker_by_id,
  WalkerProfile,
} from '../../../service/auth_service';
import { API_UPLOADS_URL } from '../../../config/constants';

interface APIWalkFromList {
  walk_id: number;
  walk_type: string;
  status: string;
  client_email: string;
  walker_email: string | null;
  days: {
    start_date: string;
    start_time: string;
    duration: number;
  }[];
  pets: {
    pet_id: number;
    name: string;
    photo: string;
    zone: string;
  }[] | null;
}

interface APIWalkFromDetail {
  walk_id: number;
  walk_type:
    | string
    | {
        walk_type_id: number;
        name: string;
      };
  status: string;
  comments: string | null;
  client: {
    user_id: number;
    email: string;
    phone: string;
  };
  walker:
    | {
        user_id: number;
        email: string;
        phone: string;
      }
    | null;
  pets: {
    pet_id: number;
    name: string;
    photo: string;
    zone: string;
  }[] | null;
  days: {
    start_date: string;
    start_time: string;
    duration: number;
  }[];
}

interface Walk {
  id: string;
  clientEmail: string;
  walkerEmail: string | null;
  petName: string;
  date: string;
  status: 'Pendiente' | 'Confirmado' | 'En curso' | 'Finalizado' | 'Cancelado';
  startTime: string;
  endTime: string;
  type: string;
}

interface DetailedWalk {
  id: string;
  clientName: string;
  walkerName: string;
  walkerAvatar: any;
  petNames: string;
  zone: string;
  date: string;
  status: 'Pendiente' | 'Confirmado' | 'En curso' | 'Finalizado' | 'Cancelado';
  startTime: string;
  endTime: string;
  type: string;
  notes: string;
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

  const [detailed, setDetailed] = useState<DetailedWalk | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterdayDate);

  useEffect(() => {
    async function loadAllWalks() {
      setLoading(true);
      try {
        let allAPIWalks: APIWalkFromList[] = [];
        let page = 1;

        while (true) {
          const batch = (await get_all_walks(page)) as unknown as APIWalkFromList[];
          if (!Array.isArray(batch) || batch.length === 0) break;
          allAPIWalks = allAPIWalks.concat(batch);
          page++;
        }

        const mapped: Walk[] = allAPIWalks.map((w) => {
          const day0 = w.days[0];
          const [year, month, dayNum] = day0.start_date.split('-').map(Number);
          const d = new Date(year, month - 1, dayNum);
          const dateStr = formatDDMMYYYY(d);

          const [hh, mm] = day0.start_time.split(':').map(Number);
          const totalMin = hh * 60 + mm + day0.duration;
          const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
          const endM = String(totalMin % 60).padStart(2, '0');
          const startTime = day0.start_time;
          const endTime = `${endH}:${endM}`;

          let statusText: Walk['status'];
          switch (w.status) {
            case 'pendiente':
              statusText = 'Pendiente';
              break;
            case 'confirmado':
              statusText = 'Confirmado';
              break;
            case 'en curso':
              statusText = 'En curso';
              break;
            case 'finalizado':
              statusText = 'Finalizado';
              break;
            case 'cancelado':
              statusText = 'Cancelado';
              break;
            default:
              statusText = (w.status.charAt(0).toUpperCase() + w.status.slice(1)) as any;
          }

          const petNames =
            Array.isArray(w.pets) && w.pets.length > 0
              ? w.pets.map((p) => p.name).join(', ')
              : '–';

          return {
            id: w.walk_id.toString(),
            clientEmail: w.client_email,
            walkerEmail: w.walker_email,
            petName: petNames,
            date: dateStr,
            status: statusText,
            startTime,
            endTime,
            type: w.walk_type,
          };
        });

        setWalks(mapped);
      } catch (err) {
        console.error('Error loading walks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllWalks();
  }, []);

  const onSelectWalk = async (walkId: string) => {
    setLoadingDetail(true);
    try {
      const apiDetail = (await get_walk_details(Number(walkId))) as APIWalkFromDetail;

      // 1) Obtener nombre del cliente siempre a través de get_user_by_id
      let clientName = apiDetail.client.email;
      try {
        const clientObj = await get_user_by_id(apiDetail.client.user_id);
        if (clientObj.name && clientObj.name.trim() !== '') {
          clientName = clientObj.name;
        }
      } catch {
        // Si falla la llamada, dejamos el email
      }

      // 2) Paseador: nombre + avatar
      let walkerName = 'Sin asignar';
      let walkerAvatar = require('../../../assets/user_icon.png');
      if (apiDetail.walker && apiDetail.walker.user_id) {
        try {
          const walkerProfile = (await get_profile_walker_by_id(
            apiDetail.walker.user_id
          )) as unknown as WalkerProfile;

          if (walkerProfile.name && walkerProfile.name.trim() !== '') {
            walkerName = walkerProfile.name;
          }

          if (walkerProfile.photo && walkerProfile.photo.startsWith('http')) {
            walkerAvatar = { uri: walkerProfile.photo };
          } else if (walkerProfile.photo) {
            walkerAvatar = {
              uri: `${API_UPLOADS_URL}/api/uploads/${walkerProfile.photo}`,
            };
          }
        } catch {
          // queda “Sin asignar” + icono por defecto
        }
      }

      // 3) Fecha y horas
      const day0 = apiDetail.days[0];
      const [year, month, dayNum] = day0.start_date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, dayNum);
      const dateStr = formatDDMMYYYY(dateObj);

      const [hh, mm] = day0.start_time.split(':').map(Number);
      const totalMin = hh * 60 + mm + day0.duration;
      const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
      const endM = String(totalMin % 60).padStart(2, '0');
      const startTime = day0.start_time;
      const endTime = `${endH}:${endM}`;

      // 4) Estado traducido
      let statusText: DetailedWalk['status'];
      switch (apiDetail.status) {
        case 'pendiente':
          statusText = 'Pendiente';
          break;
        case 'confirmado':
          statusText = 'Confirmado';
          break;
        case 'en curso':
          statusText = 'En curso';
          break;
        case 'finalizado':
          statusText = 'Finalizado';
          break;
        case 'cancelado':
          statusText = 'Cancelado';
          break;
        default:
          statusText = (apiDetail.status.charAt(0).toUpperCase() +
            apiDetail.status.slice(1)) as any;
      }

      // 5) Nombre(s) de mascota
      const petNames =
        Array.isArray(apiDetail.pets) && apiDetail.pets.length > 0
          ? apiDetail.pets.map((p) => p.name).join(', ')
          : '–';

      // 6) Zona (tomada de la primera mascota)
      const zone =
        Array.isArray(apiDetail.pets) && apiDetail.pets.length > 0
          ? apiDetail.pets[0].zone
          : '–';

      // 7) Tipo paseo (puede venir como objeto o string)
      const typeName =
        typeof apiDetail.walk_type === 'string'
          ? apiDetail.walk_type
          : apiDetail.walk_type.name;

      // 8) Notas / comments
      const notes = apiDetail.comments || '–';

      // 9) Armar objeto DetailedWalk
      const detail: DetailedWalk = {
        id: apiDetail.walk_id.toString(),
        clientName,
        walkerName,
        walkerAvatar,
        petNames,
        zone,
        date: dateStr,
        status: statusText,
        startTime,
        endTime,
        type: typeName,
        notes,
      };

      setDetailed(detail);
    } catch (err) {
      console.error('Error loading walk detail:', err);
      setDetailed(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  const sections = [
    { title: 'Hoy', data: walks.filter((w) => w.date === todayKey) },
    { title: 'Ayer', data: walks.filter((w) => w.date === yesterdayKey) },
    {
      title: 'Otros días',
      data: walks.filter(
        (w) => w.date !== todayKey && w.date !== yesterdayKey
      ),
    },
  ];

  const filteredSections = sections
    .map((sec) => ({
      title: sec.title,
      data: sec.data.filter((w) => {
        const q = query.toLowerCase();
        const matchesClient = w.clientEmail.toLowerCase().includes(q);
        const matchesStatus = filter === 'Todos' || w.status === filter;
        return matchesClient && matchesStatus;
      }),
    }))
    .filter((sec) => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Paseos" />

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
          onPress={() => setShowFilter((v) => !v)}
        >
          <Feather name="filter" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.dropdown}>
          {FILTERS.map((f) => (
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
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelectWalk(item.id)}
          >
            <View style={styles.cardRow}>
              <View style={styles.leftCol}>
                <Image
                  source={require('../../../assets/user_icon.png')}
                  style={styles.avatar}
                />
                <View style={styles.dateBox}>
                  <Feather name="calendar" size={14} color="#666" />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.owner}>{item.clientEmail}</Text>
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
        visible={detailed !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailed(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setDetailed(null)} />

          {loadingDetail ? (
            <View style={[styles.modalContent, { height: 200, justifyContent: 'center' }]}>
              <ActivityIndicator size="large" color="#0096FF" />
            </View>
          ) : (
            detailed && (
              <View style={styles.modalContent}>
                <View style={styles.handle} />

                {/* Nombre del cliente (obtenido vía get_user_by_id) */}
                <Text style={styles.modalTitle}>{detailed.clientName}</Text>

                {/* Mascotas */}
                <Text style={styles.pet}>
                  Mascota · {detailed.petNames}
                </Text>

                {/* Fecha */}
                <View style={styles.row}>
                  <Feather name="calendar" size={16} color="#666" />
                  <Text style={[styles.value, { marginLeft: 8 }]}>
                    {detailed.date}
                  </Text>
                </View>

                {/* Horas */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>Hora inicio</Text>
                    <Text style={styles.value}>{detailed.startTime}</Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>Hora término</Text>
                    <Text style={styles.value}>{detailed.endTime}</Text>
                  </View>
                </View>

                {/* Estado y Tipo */}
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>Estado</Text>
                    <Text style={styles.value}>{detailed.status}</Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>Tipo paseo</Text>
                    <Text style={styles.value}>{detailed.type}</Text>
                  </View>
                </View>

                {/* Zona */}
                <View style={[styles.row, { marginBottom: 16 }]}>
                  <View style={styles.col}>
                    <Text style={styles.label}>Zona</Text>
                    <Text style={styles.value}>{detailed.zone}</Text>
                  </View>
                </View>

                {/* Paseador: foto + nombre */}
                <Text style={[styles.label, { marginTop: 8 }]}>Paseador</Text>
                <View style={styles.walkerCard}>
                  <Image source={detailed.walkerAvatar} style={styles.walkerAvatar} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.walkerName}>{detailed.walkerName}</Text>
                  </View>
                </View>

                {/* Notas */}
                <Text style={[styles.label, { marginTop: 16 }]}>Notas</Text>
                <Text style={styles.value}>{detailed.notes}</Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDetailed(null)}
                >
                  <Text style={styles.closeButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#FFF' },
  loading:     { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchRow:   {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchBox:   {
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
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  filterBtn:   { marginLeft: 12, backgroundColor: '#0096FF', padding: 12, borderRadius: 12 },

  dropdown:      {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 4,
    overflow: 'hidden',
  },
  opt:           { paddingVertical: 12, paddingHorizontal: 16 },
  optActive:     { backgroundColor: '#0096FF' },
  optText:       { fontSize: 14, color: '#333' },
  optTextActive: { color: '#FFF', fontWeight: '600' },

  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },

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
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  leftCol: { alignItems: 'center', marginRight: 12 },
  avatar:  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DDD' },
  dateBox: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dateText:{ marginLeft: 4, fontSize: 12, color: '#666' },
  infoCol: { flex: 1 },
  owner:   { fontSize: 16, fontWeight: '600', color: '#222' },
  pet:     { fontSize: 14, color: '#555', marginTop: 2 },
  pillCol: { marginLeft: 'auto' },
  pill:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText:{ fontSize: 12, fontWeight: '600', color: '#FFF' },
  pillPending:  { backgroundColor: '#FBBF24' },
  pillAccepted: { backgroundColor: '#4CAF50' },
  pillCourse:   { backgroundColor: '#00B0FF' },
  pillDone:     { backgroundColor: '#007AFF' },
  pillCancel:   { backgroundColor: '#888' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    height: '65%',
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CCC', alignSelf: 'center', marginVertical: 12 },
  modalTitle:{ fontSize: 18, fontWeight: '600', color: '#333' },

  row:     { flexDirection: 'row', marginBottom: 12 },
  col:     { flex: 1 },
  label:   { fontSize: 12, color: '#666' },
  value:   { fontSize: 14, color: '#333', marginTop: 4 },

  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  walkerAvatar:{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#DDD' },
  walkerName:  { fontSize: 14, fontWeight: '600', color: '#333' },

  closeButton:     { marginTop: 24, backgroundColor: '#0096FF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
