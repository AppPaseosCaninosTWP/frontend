// src/screens/main/Admin/requestToChange_screen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';
import {
  see_Request_To_Change,
  approve_To_Change,
  reject_To_Change,
} from '../../../service/auth_service';

interface ChangeRequest {
  walker_id: number;
  name: string;
  email: string;
  old: {
    experience: number;
    walker_type: string;
    zone: string;
    photoUrl: string;
    description: string;
  };
  pending: {
    photo: string;
    zone: string;
    description: string;
  };
}

export default function RequestToChangeScreen() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await see_Request_To_Change();
      // Map user_model[] to ChangeRequest[]
      const mapped: ChangeRequest[] = data.map((user: any) => ({
        walker_id: user.walker_id,
        name: user.name,
        email: user.email,
        old: {
          experience: user.old?.experience,
          walker_type: user.old?.walker_type,
          zone: user.old?.zone,
          photoUrl: user.old?.photoUrl,
          description: user.old?.description,
        },
        pending: {
          photo: user.pending?.photo,
          zone: user.pending?.zone,
          description: user.pending?.description,
        },
      }));
      setRequests(mapped);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    setProcessingId(id);
    try {
      await approve_To_Change(id);
      setRequests(rs => rs.filter(r => r.walker_id !== id));
    } catch (err) {
      console.error('Error aprobando cambio:', err);
      Alert.alert('Error', 'No se pudo aprobar la solicitud');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: number) {
    setProcessingId(id);
    try {
      await reject_To_Change(id);
      setRequests(rs => rs.filter(r => r.walker_id !== id));
    } catch (err) {
      console.error('Error rechazando cambio:', err);
      Alert.alert('Error', 'No se pudo rechazar la solicitud');
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <HeaderAdmin title="Solicitudes de Cambio" />
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>No hay solicitudes pendientes.</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ChangeRequest }) => {
    const isProcessing = processingId === item.walker_id;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Feather name="user" size={24} color="#333" style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.email}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Antes</Text>
          <Text style={styles.sectionText}>Tipo: {item.old.walker_type}</Text>
          <Text style={styles.sectionText}>Zona: {item.old.zone}</Text>
          <Text style={styles.sectionText}>Experiencia: {item.old.experience} años</Text>
          <Text style={styles.sectionText}>Descripción: {item.old.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propuesto</Text>
          <Text style={styles.sectionText}>Zona: {item.pending.zone}</Text>
          <Text style={styles.sectionText}>Descripción: {item.pending.description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.approveBtn]}
            disabled={isProcessing}
            onPress={() => handleApprove(item.walker_id)}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Aprobar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            disabled={isProcessing}
            onPress={() => handleReject(item.walker_id)}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Rechazar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Solicitudes de Cambio" />
      <FlatList
        data={requests}
        keyExtractor={item => String(item.walker_id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#FFF' },
  loading:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer:  { flex: 1, backgroundColor: '#FFF' },
  emptyContent:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText:       { fontSize: 16, color: '#666' },

  list:            { padding: 16, paddingBottom: 24 },

  card:            {
                     backgroundColor: '#FFF',
                     borderRadius: 12,
                     padding: 16,
                     marginBottom: 12,
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.05,
                     shadowRadius: 4,
                     elevation: 2,
                   },

  header:          { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title:           { fontSize: 16, fontWeight: '600', color: '#222' },
  sub:             { fontSize: 14, color: '#666', marginTop: 2 },

  section:         { marginTop: 8 },
  sectionTitle:    { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  sectionText:     { fontSize: 13, color: '#555', marginTop: 2 },

  actions:         {
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     marginTop: 16,
                   },
  btn:             {
                     flex: 1,
                     paddingVertical: 10,
                     borderRadius: 8,
                     alignItems: 'center',
                     marginHorizontal: 4,
                   },
  approveBtn:      { backgroundColor: '#28A745' },
  rejectBtn:       { backgroundColor: '#DC3545' },
  btnText:         { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
