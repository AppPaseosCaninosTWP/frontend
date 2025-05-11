import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function DashboardPaseadorScreen() {
  const [assigned_walks, set_assigned_walks] = useState([
    {
      pet_name: 'Maxi',
      owner: 'Juan Pérez',
      time: '10:30 AM',
      image: require('../../assets/menu_dog.png'),
    },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Hola, Caminante</Text>

      <Text style={styles.section_title}>Paseos asignados</Text>

      {assigned_walks.length === 0 ? (
        <View style={styles.empty_box}>
          <Text style={styles.empty_text}>No tienes paseos asignados por ahora</Text>
        </View>
      ) : (
        assigned_walks.map((walk, index) => (
          <View key={index} style={styles.walk_card}>
            <Image source={walk.image} style={styles.pet_image} />
            <View style={styles.walk_info}>
              <Text style={styles.pet_name}>{walk.pet_name}</Text>
              <Text style={styles.detail}>Propietario: {walk.owner}</Text>
              <Text style={styles.detail}>Hora: {walk.time}</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.button_text}>Ver historial de paseos</Text>
      </TouchableOpacity>
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section_title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  empty_box: {
    padding: 30,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  empty_text: {
    color: '#6B7280',
    fontSize: 14,
  },
  walk_card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  pet_image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  walk_info: {
    flex: 1,
  },
  pet_name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  button_text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
