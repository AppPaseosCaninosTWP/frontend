import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { use_pet_creation } from '../../../context/pet_creation_context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

const ZONES = ['Norte', 'Centro', 'Sur'];

export default function StepZonaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [selected_zone, set_selected_zone] = useState(pet_data.zone);

  const handle_continue = () => {
    set_pet_data({ zone: selected_zone });
    console.log('Zona seleccionada:', selected_zone); // luego reemplazar con siguiente paso
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header_title}>Agregar perfil de mascota</Text>
      <Text style={styles.step_info}>Zona (2/9)</Text>

      <View style={styles.progress_bar}>
        <View style={styles.progress_fill} />
      </View>

      <Text style={styles.question}>¿En qué sector vives?</Text>

      <View style={styles.options_container}>
        {ZONES.map((zone) => (
          <TouchableOpacity
            key={zone}
            onPress={() => set_selected_zone(zone)}
            style={[
              styles.option_button,
              selected_zone === zone && styles.option_selected,
            ]}
          >
            <Text
              style={[
                styles.option_text,
                selected_zone === zone && styles.option_text_selected,
              ]}
            >
              {zone}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handle_continue}
          disabled={!selected_zone}
          style={[styles.button, !selected_zone && styles.button_disabled]}
        >
          <Text style={styles.button_text}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handle_continue}>
          <Text style={styles.skip_text}>Saltar por ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header_title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  step_info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  progress_bar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progress_fill: {
    width: '22.2%', // paso 2 de 9
    height: '100%',
    backgroundColor: '#007BFF',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  options_container: {
    gap: 12,
    marginBottom: 20,
  },
  option_button: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  option_selected: {
    backgroundColor: '#007BFF',
  },
  option_text: {
    fontSize: 16,
    color: '#333',
  },
  option_text_selected: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 10,
  },
  button_disabled: {
    backgroundColor: '#A0CFFF',
  },
  button_text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  skip_text: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
