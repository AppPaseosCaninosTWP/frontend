import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';

interface HeaderProps {
  role: 'cliente' | 'paseador' | 'admin';
  name?: string; // opcional por si algún rol tiene nombre en el futuro
  on_menu_press?: () => void;
  on_search_press?: () => void;
}

export default function Header({
  role,
  name,
  on_menu_press,
  on_search_press,
}: HeaderProps) {
  const display_name = name ? `Hola, ${name}` : 'Hola';

  return (
    <View style={styles.container}>
      <View style={styles.user_info}>
        <FontAwesome name="user-circle" size={32} color="#333" style={styles.avatar_icon} />
        <Text style={styles.greeting}>{display_name}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={on_search_press}>
          <Feather name="search" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={on_menu_press} style={styles.menu_icon}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 132,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  user_info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar_icon: {
    marginRight: 8,
  },
  greeting: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu_icon: {
    marginLeft: 16,
  },
});
