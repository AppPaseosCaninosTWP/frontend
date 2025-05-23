import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface continue_button_props {
  on_press: () => void;
  text?: string;
  disabled?: boolean;
}

export default function Continue_button({
  on_press,
  text = 'Continuar',
  disabled = false,
}: continue_button_props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.button_disabled]}
      onPress={on_press}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.button_text, disabled && styles.text_disabled]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  button_disabled: {
    backgroundColor: '#A0CFFF',
  },
  button_text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  text_disabled: {
    color: '#f1f1f1',
  },
});

