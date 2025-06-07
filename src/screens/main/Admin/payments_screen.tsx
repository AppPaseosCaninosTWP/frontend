// src/screens/main/Admin/payments_screen.tsx
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

import { get_all_payments } from '../../../service/payment_service';
import { get_walk_details } from '../../../service/walk_service';
import { get_user_by_id } from '../../../service/user_service';
import { get_profile_walker_by_id } from '../../../service/walker_service';
import type { payment_model } from '../../../models/payment_model';
import type { APIWalkFromDetail } from '../../../models/walk_model';
import type { WalkerProfile } from '../../../models/walker_model';
import type { PaymentUI } from '../../../models/payment_model';
import { API_UPLOADS_URL } from '../../../config/constants';

type Filter = 'all' | 'paid' | 'pending';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'paid', label: 'Pagados' },
  { key: 'pending', label: 'Pendientes' },
];

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function Payments_screen() {
  const [payments, setPayments] = useState<PaymentUI[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<PaymentUI | null>(null);

  const todayKey = formatDDMMYYYY(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDDMMYYYY(yesterday);

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        const raw: payment_model[] = await get_all_payments();
        const mapped: PaymentUI[] = [];

        for (const p of raw) {
          let walkDetail: APIWalkFromDetail;
          try {
            walkDetail = await get_walk_details(p.walk_id);
          } catch {
            continue;
          }

          // 1) Cliente
          let clientName = walkDetail.client.email;
          try {
            const usr = await get_user_by_id(walkDetail.client.user_id);
            if (usr.name?.trim()) clientName = usr.name;
          } catch {}

          // 2) Mascotas y zona
          const petNames =
            Array.isArray(walkDetail.pets) && walkDetail.pets.length > 0
              ? walkDetail.pets.map(pet => pet.name).join(', ')
              : '–';
          const zone = walkDetail.pets?.[0]?.zone || '–';

          // 3) Fecha y horas
          const day0 = walkDetail.days[0];
          const [y, m, d] = day0.start_date.split('-').map(Number);
          const date = formatDDMMYYYY(new Date(y, m - 1, d));
          const startTime = day0.start_time;
          const [hh, mm] = startTime.split(':').map(Number);
          const totalMin = hh * 60 + mm + day0.duration;
          const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
          const endM = String(totalMin % 60).padStart(2, '0');
          const endTime = `${endH}:${endM}`;

          // 4) Tipo de paseo
          const type =
            typeof walkDetail.walk_type === 'string'
              ? walkDetail.walk_type
              : walkDetail.walk_type.name;

          // 5) Estado de pago
          const paymentStatus =
            p.status === 'completed' || p.status === 'pagado'
              ? 'Pagado'
              : 'Pendiente';

          // 6) Monto y comisión
          const fee = p.amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          });
          const rawCommission = Math.round(p.amount * 0.10);
          const commission = rawCommission.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          });

          // 7) Paseador
          let walkerName = 'Sin asignar';
          let walkerAvatar = require('../../../assets/user_icon.png');
          if (walkDetail.walker) {
            try {
              const prof = (await get_profile_walker_by_id(
                walkDetail.walker.user_id
              )) as unknown as WalkerProfile;
              if (prof.name?.trim()) walkerName = prof.name;
              if (prof.photo?.startsWith('http')) {
                walkerAvatar = { uri: prof.photo };
              } else if (prof.photo) {
                walkerAvatar = {
                  uri: `${API_UPLOADS_URL}/api/uploads/${prof.photo}`,
                };
              }
            } catch {}
          }

          mapped.push({
            id: String(p.payment_id),
            clientName,
            petNames,
            date,
            paymentStatus,
            zone,
            fee,
            commission,
            startTime,
            endTime,
            type,
            walkerName,
            walkerAvatar,
          });
        }

        setPayments(mapped);
      } catch (err) {
        console.error('Error cargando pagos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  // Agrupar y filtrar
  const sections = [
    { title: 'Hoy', data: payments.filter(p => p.date === todayKey) },
    { title: 'Ayer', data: payments.filter(p => p.date === yesterdayKey) },
    {
      title: 'Otros días',
      data: payments.filter(
        p => p.date !== todayKey && p.date !== yesterdayKey
      ),
    },
  ];
  const filtered = sections
    .map(sec => ({
      title: sec.title,
      data: sec.data.filter(p => {
        const q = query.trim().toLowerCase();
        const matchQ = p.clientName.toLowerCase().includes(q);
        const matchF =
          filter === 'all' ||
          (filter === 'paid' && p.paymentStatus === 'Pagado') ||
          (filter === 'pending' && p.paymentStatus === 'Pendiente');
        return matchQ && matchF;
      }),
    }))
    .filter(sec => sec.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Pagos" />

      {/* Segment control */}
      <View style={styles.segmented}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.segment, filter === f.key && styles.segmentActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.segmentText,
                filter === f.key && styles.segmentTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de pagos */}
      <SectionList
        sections={filtered}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.clientName}</Text>
              <Text style={styles.cardSub}>Mascotas · {item.petNames}</Text>
              <Text style={styles.zoneText}>Zona: {item.zone}</Text>
              <View style={styles.row}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.cardMeta}>{item.date}</Text>
                <Feather name="clock" size={14} color="#666" />
                <Text style={styles.cardMeta}>
                  {item.startTime}–{item.endTime}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.pill,
                item.paymentStatus === 'Pagado'
                  ? styles.pillPaid
                  : styles.pillPending,
              ]}
            >
              {item.paymentStatus}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal detalle */}
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
              <Text style={styles.modalTitle}>{selected.clientName}</Text>
              <Text style={styles.modalSub}>
                Mascotas · {selected.petNames}
              </Text>
              <Text style={styles.modalSub}>Zona: {selected.zone}</Text>

              <View style={styles.modalRow}>
                <View style={styles.modalCol}>
                  <Text style={styles.label}>Fecha</Text>
                  <Text style={styles.value}>{selected.date}</Text>
                </View>
                <View style={styles.modalCol}>
                  <Text style={styles.label}>Hora</Text>
                  <Text style={styles.value}>
                    {selected.startTime}–{selected.endTime}
                  </Text>
                </View>
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalCol}>
                  <Text style={styles.label}>Tipo</Text>
                  <Text style={styles.value}>{selected.type}</Text>
                </View>
                <View style={styles.modalCol}>
                  <Text style={styles.label}>Monto</Text>
                  <Text style={styles.value}>{selected.fee}</Text>
                </View>
              </View>

              {/* Comisión 10% */}
              <View style={styles.modalRow}>
                <View style={styles.modalCol}>
                  <Text style={styles.label}>Comisión (10%)</Text>
                  <Text style={styles.value}>{selected.commission}</Text>
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>Paseador</Text>
              <View style={styles.walkerCard}>
                <Image
                  source={selected.walkerAvatar}
                  style={styles.walkerAvatar}
                />
                <Text style={styles.walkerName}>{selected.walkerName}</Text>
              </View>

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
  );
}

const ACCENT = '#0096FF';
const BG = '#F7F7F7';
const CARD = '#FFFFFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    overflow: 'hidden',
    margin: 16,
  },
  segment: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  segmentActive: { backgroundColor: ACCENT },
  segmentText: { fontSize: 14, color: '#555' },
  segmentTextActive: { color: '#FFF', fontWeight: '600' },

  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
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
    marginHorizontal: 16,
    color: '#444',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    marginHorizontal: 16,
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
    marginRight: 16,
  },
  pillPaid: { backgroundColor: '#28A745' },
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
  modalSub: { fontSize: 14, color: '#555', marginBottom: 8 },
  modalRow: { flexDirection: 'row', marginBottom: 12 },
  modalCol: { flex: 1 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, color: '#333', marginTop: 4 },

  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
  },
  walkerAvatar: { width: 40, height: 40, borderRadius: 20 },
  walkerName: { fontSize: 14, fontWeight: '600', color: '#222' },

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