import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CreatePetHeaderProps {
  title: string;
  subtitle: string;
  step: number;
  total_steps?: number;
}

export default function CreatePetHeader({
  title,
  subtitle,
  step,
  total_steps = 9,
}: CreatePetHeaderProps) {
  const progress = (step / total_steps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header_row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.step_text}>
          Step <Text style={styles.step_number}>{`${step}/${total_steps}`}</Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.progress_bar}>
        <View style={[styles.progress_fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  header_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111',
  },
  step_text: {
    fontSize: 14,
    color: '#999',
  },
  step_number: {
    color: '#111',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 12,
  },
  progress_bar: {
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress_fill: {
    height: '100%',
    backgroundColor: '#FFB200', // amarillo como en Figma
  },
});
