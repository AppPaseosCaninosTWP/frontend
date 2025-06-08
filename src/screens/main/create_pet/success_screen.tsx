import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

export default function Success_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/empty_state.png')}
        style={styles.success_image}
      />

      <Text style={styles.title_text}>¡Mascota registrada!</Text>
      <Text style={styles.subtitle_text}>
        Tu perfil de mascota se ha guardado exitosamente.
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'dashboard_cliente' }],
          })
        }
        style={styles.primary_button}
      >
        <Text style={styles.primary_button_text}>Ir al inicio</Text>
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
  success_image: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title_text: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  subtitle_text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  primary_button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  primary_button_text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
