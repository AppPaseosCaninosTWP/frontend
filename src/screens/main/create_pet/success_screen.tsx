import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

export default function SuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/empty_state.png')} // usa una imagen de éxito
        style={styles.image}
      />

      <Text style={styles.title}>¡Mascota registrada!</Text>
      <Text style={styles.subtitle}>Tu perfil de mascota se ha guardado exitosamente.</Text>

      <TouchableOpacity
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardCliente' }],
        })}
        style={styles.button}
      >
        <Text style={styles.button_text}>Ir al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  button_text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
