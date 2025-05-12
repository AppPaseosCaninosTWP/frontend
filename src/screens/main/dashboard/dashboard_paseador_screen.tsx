import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import Header from '../../../components/shared/header';

export default function DashboardPaseadorScreen() {
  const [assigned_walks] = useState([
    {
      pet_name: 'Maxi',
      zone: 'Antofagasta',
      time: '11:00',
      image: require('../../../assets/breeds/golden.png'),
    },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header role="paseador" />
      
      <Text style={styles.section_title}>
        Tu próximo paseo <Text style={styles.badge}>{assigned_walks.length}</Text>
      </Text>

      {assigned_walks.map((walk, index) => (
        <View key={index} style={styles.walk_card}>
          <View style={styles.walk_text}>
            <Text style={styles.pet_name}>{walk.pet_name}</Text>
            <Text style={styles.detail}>{walk.zone} | {walk.time}</Text>
          </View>
          <Image source={walk.image} style={styles.pet_image} />
        </View>
      ))}


      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/plate_icon.png')} style={styles.icon} />
          <Text style={styles.card_title}>Mi Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/admin/admin_photo1.png')} style={styles.icon} />
          <Text style={styles.card_title}>Calificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/admin/admin_photo2.png')} style={styles.icon} />
          <Text style={styles.card_title}>Historial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  section_title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#E6F4FF',
    color: '#007BFF',
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 14,
  },
  walk_card: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walk_text: {
    flex: 1,
  },
  pet_name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  detail: {
    color: '#D0E7FF',
    fontSize: 14,
    marginTop: 4,
  },
  pet_image: {
    width: 90,
    height: 90,
    borderRadius: 30,
    marginLeft: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  card_title: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
