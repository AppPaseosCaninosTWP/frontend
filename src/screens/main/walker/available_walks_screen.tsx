import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { get_token } from '../../../utils/token_service';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface BackendWalk {
  walk_id: number;
  walk_type: string;
  status: string;
  comments: string | null;
  days: { start_date: string; start_time: string; duration: number }[];
  pet: {
    id: number;
    name: string;
    avatarUrl: string;
    description: string;
    age: number;
    zone: string;
  } | null;
}

export default function AvailableWalksScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [allWalks, setAllWalks] = useState<BackendWalk[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Fijo' | 'Esporádico'>('Fijo');

  useEffect(() => {
    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    setLoading(true);
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.error) throw new Error(json.msg || 'Error desconocido');
      setAllWalks(json.data);
    } catch (err: any) {
      Alert.alert('Error al cargar paseos', err.message);
    } finally {
      setLoading(false);
    }
  };

  const walksToShow = allWalks.filter(
    (w) => w.walk_type.toLowerCase() === selectedTab.toLowerCase()
  );

  const renderItem = ({ item }: { item: BackendWalk }) => {
    const pet = item.pet;
    const firstDay = item.days[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('PetProfileScreen', {
            walkId: item.walk_id,
          })
        }
      >
        <View style={styles.cardHeader}>
          {pet ? (
            <Image source={{ uri: pet.avatarUrl }} style={styles.avatar} />
          ) : (
            <Feather name="user" size={48} color="#ccc" style={styles.avatar} />
          )}

          <View style={styles.info}>
            {pet && (
              <>
                <Text style={styles.name}>{pet.name}</Text>
                <Text style={styles.meta}>{pet.description}</Text>
              </>
            )}
            <Text style={styles.meta}>
              {selectedTab === 'Fijo'
                ? `${item.days.length} día(s) a las ${firstDay.start_time}`
                : `${firstDay.start_date} a las ${firstDay.start_time}`}
            </Text>
          </View>

          <Feather name="chevron-right" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paseos disponibles</Text>
      </View>

      <View style={styles.tabContainer}>
        {(['Fijo', 'Esporádico'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              Paseos {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={walksToShow}
          keyExtractor={(w) => w.walk_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No hay paseos {selectedTab.toLowerCase()} disponibles
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 0.9,
    color: '#111',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: { fontSize: 14, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },

  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  meta: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
});
