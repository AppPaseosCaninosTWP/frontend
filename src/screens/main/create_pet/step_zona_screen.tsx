import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { use_pet_creation } from '../../../context/pet_creation_context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

import CreatePetHeader from '../../../components/create_pet/create_pet_header';
import ContinueButton from '../../../components/shared/continue_button';

const zone_options = ['Norte', 'Centro', 'Sur'];

export default function Step_zona_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet_data, set_pet_data } = use_pet_creation();
  const [selected_zone, set_selected_zone] = useState(pet_data.zone);

  const handle_continue = () => {
    set_pet_data({ zone: selected_zone });
    navigation.navigate('StepNameScreen');
  };

  return (
    <View style={styles.container}>
      <CreatePetHeader
        title="Agregar perfil de mascota"
        subtitle="Zona"
        step={2}
        on_back_press={() => navigation.goBack()}
      />

      <Text style={styles.question}>¿En qué sector vives?</Text>

      <View style={styles.options_container}>
        {zone_options.map((zone) => (
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
        <ContinueButton
          on_press={handle_continue}
          disabled={!selected_zone}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
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
    paddingBottom: 30,
  },
});