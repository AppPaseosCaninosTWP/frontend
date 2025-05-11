import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ContinueButtonProps {
  on_press: () => void;
  text?: string;
  disabled?: boolean;
}

export default function ContinueButton({
  on_press,
  text = 'Continuar',
  disabled = false,
}: ContinueButtonProps) {
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
