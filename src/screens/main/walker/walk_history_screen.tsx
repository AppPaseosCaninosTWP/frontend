import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

const historyItems = [
  { id: '1', date: '11.05.2025', time: '09:30', label: 'Paseo fijo' },
  { id: '2', date: '10.05.2025', time: '09:30', label: 'Paseo de prueba' },
  { id: '3', date: '09.05.2025', time: '09:30', label: 'Paseo de prueba' },
];

export default function WalkHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapCard}>
          <Image source={require('../../../assets/map_sample.png')} style={styles.map} />
          <View style={styles.marker}>
            <Image source={require('../../../assets/user_icon.png')} style={styles.markerAvatar} />
          </View>
          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>14.05.2025 | 09:30</Text>
            <View style={styles.mapFooterRow}>
              <Image source={require('../../../assets/walk.png')} style={styles.icon} />
              <Text style={styles.mapFooterLabel}>Paseo fijo</Text>
            </View>
          </View>
        </View>

        {historyItems.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.historyTime}>{item.date} | {item.time}</Text>
            <View style={styles.mapFooterRow}>
              <Image source={require('../../../assets/walk.png')} style={styles.icon} />
              <Text style={styles.historyLabel}>{item.label}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '600',
    flex: 0.9,
    textAlign: 'center',
    color: '#111',
  },
  scrollContent: {
    padding: 16,
  },
  mapCard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: 180,
  },
  marker: {
    position: 'absolute',
    top: 70,
    left: '45%',
    zIndex: 2,
  },
  markerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapFooter: {
    backgroundColor: '#fff',
    padding: 12,
  },
  mapFooterText: {
    color: '#888',
    fontSize: 14,
  },
  mapFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mapFooterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});