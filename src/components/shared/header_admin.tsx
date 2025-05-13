// src/components/shared/header_admin.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface HeaderAdminProps {
  title: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <>
      {/* Asegura fondo blanco bajo el status bar */}
      <SafeAreaView style={styles.safeArea} />
      {/* Barra superior */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      {/* Espacio extra antes del contenido */}
      <View style={styles.bottomSpacer} />
    </>
  );
};

export default HeaderAdmin;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'android' ? { height: StatusBar.currentHeight } : {}),
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 24, // mismo ancho que el icono para centrar
  },
  bottomSpacer: {
    height: 24,           // ajusta este valor si necesitas más o menos espacio
    backgroundColor: '#FFFFFF',
  },
});
