import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CreatePetHeaderProps {
  title: string;
  subtitle: string;
  step: number;
  total_steps?: number;
  on_back_press?: () => void;
}

export default function CreatePetHeader({
  title,
  subtitle,
  step,
  total_steps = 9,
  on_back_press,
}: CreatePetHeaderProps) {
  const progress = (step / total_steps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.top_row}>
        {on_back_press && (
          <TouchableOpacity onPress={on_back_press} style={styles.back_button}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
        )}

        <View style={styles.centered_text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Text style={styles.step_text}>
          Paso <Text style={styles.step_count}>{step}/{total_steps}</Text>
        </Text>
      </View>

      <View style={styles.progress_bar}>
        <View style={[styles.progress_fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  top_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back_button: {
    paddingRight: 12,
  },
  centered_text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  step_text: {
    fontSize: 13,
    color: '#999',
  },
  step_count: {
    fontWeight: '500',
  },
  progress_bar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progress_fill: {
    height: '100%',
    backgroundColor: '#FFB200',
  },
});


