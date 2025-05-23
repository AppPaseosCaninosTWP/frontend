import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface create_pet_header_props {
  title: string;
  subtitle: string;
  step: number;
  total_steps?: number;
  on_back_press?: () => void;
}

export default function Create_pet_header({
  title,
  subtitle,
  step,
  total_steps = 6,
  on_back_press,
}: create_pet_header_props) {
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
          <Text style={styles.title_text}>{title}</Text>
          <Text style={styles.subtitle_text}>{subtitle}</Text>
        </View>

        <View style={styles.step_text_row}>
          <Text style={styles.step_text}>Paso </Text>
          <Text style={[styles.step_text, styles.step_count]}>
            {step}/{total_steps}
          </Text>
        </View>
      </View>

      <View style={styles.progress_bar}>
        <View style={[styles.progress_fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  top_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back_button: {
    paddingRight: 0,
  },
  centered_text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
  },
  title_text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  subtitle_text: {
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
  step_text_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});



