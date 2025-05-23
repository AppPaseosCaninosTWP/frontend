import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { get_token } from '../../utils/token_service';

interface Notification {
  id:        number;
  message:   string;
  createdAt: string;
  read:      boolean;
}

interface NotificationCenterProps {
  userId: number;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [visible, setVisible]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await get_token();
        const res   = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/notifications?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 404) {
          // Si no existe el endpoint, asumimos “sin notificaciones”
          setNotifications([]);
        } else if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        } else {
          const json = await res.json();
          setNotifications(json.data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [visible, userId]);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.bellButton}>
        <Feather name="bell" size={24} color="#000" />
        {notifications.filter(n => !n.read).length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notifications.filter(n => !n.read).length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Notificaciones</Text>
            {loading ? (
              <ActivityIndicator />
            ) : error ? (
              <Text style={styles.error}>{error}</Text>
            ) : notifications.length === 0 ? (
              <Text style={styles.empty}>No tienes notificaciones</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={n => n.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={[styles.msg, item.read && styles.read]}>
                      {item.message}
                    </Text>
                    <Text style={styles.date}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                )}
              />
            )}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellButton: { marginRight: 16 },
  badge: {
    position: 'absolute', right: -4, top: -4,
    backgroundColor: 'red', borderRadius: 8, paddingHorizontal: 4
  },
  badgeText: { color: 'white', fontSize: 10 },
  overlay: {
    flex:1, justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modal: {
    width:'80%', maxHeight:'70%',
    backgroundColor:'#fff', borderRadius:8, padding:16
  },
  title: { fontSize:18, fontWeight:'600', marginBottom:12 },
  error: { color:'red' },
  empty: { textAlign:'center', color:'#666' },
  item: { marginBottom:12 },
  msg: { fontSize:16 },
  read: { color:'#999' },
  date: { fontSize:12, color:'#888', marginTop:4 },
  closeBtn: {
    marginTop:12, alignSelf:'flex-end', padding:8
  },
  closeText: { color:'#007AFF', fontWeight:'600' },
});
