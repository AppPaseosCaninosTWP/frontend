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
import { get_user_by_id } from '../../../service/user_service';
import { get_profile_walker_by_id } from '../../../service/walker_service';
import { WalkerProfile } from '../../../models/walker_model';
import { get_all_walks, get_walk_details } from '../../../service/walk_service';
import { API_UPLOADS_URL } from '../../../config/constants';

// Importamos los tipos movidos a models/walk_model.ts
import type {
  APIWalkFromDetail,
  DetailedWalk as ModelDetailedWalk,
  walk_model,
} from '../../../models/walk_model';

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

/**
 * Interfaz local para renderizar cada paseo en la lista
 */
interface Walk {
  id: string;
  clientName: string; // Nombre real del cliente (o email si hubo error)
  petNames: string;   // Todos los nombres de mascotas, separados por coma
  date: string;       // “DD.MM.YYYY”
  status: 'Pendiente' | 'Confirmado' | 'En curso' | 'Finalizado' | 'Cancelado';
  startTime: string;  // Horario inicio “HH:MM”
  endTime: string;    // Horario fin “HH:MM”
  type: string;       // Tipo de paseo
}

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function WalksScreen() {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('Todos');
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [detailed, setDetailed] = useState<ModelDetailedWalk | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Para agrupar: hoy, ayer, otros días
  const todayKey = formatDDMMYYYY(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterdayDate);

  useEffect(() => {
    async function loadAllWalks() {
      setLoading(true);
      try {
        // 1) Traigo todos los paseos resumidos (walk_model[])
        const allAPIWalks = (await get_all_walks()) as walk_model[];

        // 2) Hago Promise.all para obtener detalles de cada paseo
        const mappedWalks: Walk[] = await Promise.all(
          allAPIWalks.map(async (w) => {
            // 2.a) Obtener detalle completo por ID
            let detail: APIWalkFromDetail | null = null;
            try {
              detail = (await get_walk_details(w.walk_id)) as APIWalkFromDetail;
            } catch (err) {
              console.warn(`No se pudo cargar detalle del paseo ${w.walk_id}:`, err);
            }

            // 2.b) Sacar nombre real de cliente o fallback email
            let clientName = '–';
            if (detail && detail.client) {
              clientName = detail.client.email;
              try {
                const clientObj = await get_user_by_id(detail.client.user_id);
                if (clientObj.name && clientObj.name.trim().length > 0) {
                  clientName = clientObj.name;
                }
              } catch {
                // Si falla, dejamos el email
              }
            }

            // 2.c) Sacar todos los nombres de mascotas separados por coma
            let petNames = '–';
            if (detail && Array.isArray(detail.pets) && detail.pets.length > 0) {
              petNames = detail.pets.map((p) => p.name).join(', ');
            }

            // 2.d) Formatear fecha a DD.MM.YYYY
            let dateStr = '–';
            if (w.date) {
              const [year, month, dayNum] = w.date.split('-').map(Number);
              dateStr = formatDDMMYYYY(new Date(year, month - 1, dayNum));
            }

            // 2.e) Calcular hora inicio y fin
            let startTime = w.time ?? '00:00';
            let endTime = '00:00';
            if (w.time && typeof w.duration === 'number') {
              const [hh, mm] = w.time.split(':').map(Number);
              const totalMin = hh * 60 + mm + w.duration;
              const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
              const endM = String(totalMin % 60).padStart(2, '0');
              endTime = `${endH}:${endM}`;
            }

            // 2.f) Traducir estado a capitalizado
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

            // 2.g) Tipo de paseo
            const typeName = w.walk_type || '–';

            // 3) Armar objeto de tipo Walk
            return {
              id: w.walk_id.toString(),
              clientName,
              petNames,
              date: dateStr,
              status: statusText,
              startTime,
              endTime,
              type: typeName,
            };
          })
        );

        setWalks(mappedWalks);
      } catch (err) {
        console.error('Error cargando paseos:', err);
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

      // Nombre real del cliente
      let clientName = apiDetail.client.email;
      try {
        const clientObj = await get_user_by_id(apiDetail.client.user_id);
        if (clientObj.name && clientObj.name.trim() !== '') {
          clientName = clientObj.name;
        }
      } catch {
        // fallback a email
      }

      // Paseador: nombre y avatar
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
          // deja “Sin asignar”
        }
      }

      // Fecha y horas
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

      // Estado traducido
      let statusText: ModelDetailedWalk['status'];
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

      // Todas las mascotas
      const petNames =
        Array.isArray(apiDetail.pets) && apiDetail.pets.length > 0
          ? apiDetail.pets.map((p) => p.name).join(', ')
          : '–';

      // Zona (primera mascota)
      const zone =
        Array.isArray(apiDetail.pets) && apiDetail.pets.length > 0
          ? apiDetail.pets[0].zone
          : '–';

      // Tipo paseo
      const typeName =
        typeof apiDetail.walk_type === 'string'
          ? apiDetail.walk_type
          : apiDetail.walk_type.name;

      // Notas
      const notes = apiDetail.comments || '–';

      const detail: ModelDetailedWalk = {
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
      console.error('Error cargando detalle del paseo:', err);
      setDetailed(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Si sigue cargando toda la lista, muestro el loader
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  // Agrupo en secciones: Hoy, Ayer, Otros días
  const sections = [
    { title: 'Hoy', data: walks.filter((w) => w.date === todayKey) },
    { title: 'Ayer', data: walks.filter((w) => w.date === yesterdayKey) },
    {
      title: 'Otros días',
      data: walks.filter((w) => w.date !== todayKey && w.date !== yesterdayKey),
    },
  ];

  // FILTRADO: buscar por cliente + estado
  const filteredSections = sections
    .map((sec) => ({
      title: sec.title,
      data: sec.data.filter((w) => {
        const q = query.trim().toLowerCase();
        // ← Aquí aplicamos el safe-check gracias al “|| ''”
        const matchesClient = (w.clientName || '').toLowerCase().includes(q);
        const matchesStatus = filter === 'Todos' || w.status === filter;
        return matchesClient && matchesStatus;
      }),
    }))
    .filter((sec) => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Paseos" />

      {/* ── BARRA DE BÚSQUEDA + BOTÓN FILTRO ── */}
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
      {/* ──────────────────────────────────────── */}

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
                {/* Nombre real del cliente */}
                <Text style={styles.owner}>{item.clientName}</Text>
                {/* Todas las mascotas separadas por coma */}
                <Text style={styles.pet}>Mascotas · {item.petNames}</Text>
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

      {/* ── MODAL DE DETALLE ── */}
      <Modal
        visible={detailed !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailed(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setDetailed(null)}
          />

          {loadingDetail ? (
            <View
              style={[
                styles.modalContent,
                { height: 200, justifyContent: 'center' },
              ]}
            >
              <ActivityIndicator size="large" color="#0096FF" />
            </View>
          ) : (
            detailed && (
              <View style={styles.modalContent}>
                <View style={styles.handle} />

                {/* Nombre del cliente */}
                <Text style={styles.modalTitle}>{detailed.clientName}</Text>

                {/* Mascotas */}
                <Text style={styles.pet}>Mascotas · {detailed.petNames}</Text>

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
                  <Image
                    source={detailed.walkerAvatar}
                    style={styles.walkerAvatar}
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.walkerName}>
                      {detailed.walkerName}
                    </Text>
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
      {/* ──────────────────────────── */}
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