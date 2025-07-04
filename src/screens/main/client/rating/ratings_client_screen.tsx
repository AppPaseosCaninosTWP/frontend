import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ComingSoonScreen() {
  return (
    <View style={styles.container}>
      <Feather name="tool" size={64} color="#3b82f6" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>¡Estamos trabajando en ello!</Text>
      <Text style={styles.subtitle}>
        Esta funcionalidad estará disponible próximamente. Mantente atento a las actualizaciones.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 200,
    opacity: 0.8,
  },
});
