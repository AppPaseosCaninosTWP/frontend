import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { user_model } from '../../../models/user_model';
import { get_user, clear_session } from '../../../utils/token_service';

import ScreenWithMenu from '../../../components/shared/screen_with_menu';
import type { menu_option } from '../../../components/shared/side_menu';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Dashboard_admin_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, set_user] = useState<user_model | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored_user = await get_user();
      if (!stored_user || stored_user.role_id !== 1) {
        await clear_session();
        Alert.alert('Acceso denegado', 'Debes iniciar sesión como administrador.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
        return;
      }
      set_user(stored_user);
      set_loading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Siempre usamos el ícono por defecto para el admin:
  const profileImageSource = require('../../../assets/user_icon.png');

  const menu_options: menu_option[] = [
    {
      label: 'Dashboard',
      icon: <Feather name="layout" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('dashboard_admin'),
    },
    { label: '__separator__', icon: null, on_press: () => { } },
    {
      label: 'Usuarios',
      icon: <Ionicons name="people" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('user_screen'),
    },
    {
      label: 'Paseos',
      icon: <Ionicons name="walk" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('walks_screen'),
    },
    {
      label: 'Pagos',
      icon: <MaterialIcons name="payment" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('payments_screen'),
    },
    {
      label: 'Solicitudes',
      icon: <MaterialIcons name="request-page" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('request_to_change_screen'),
    },
    {
      label: 'Registrar Paseador',
      icon: <MaterialIcons name="person-add" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('register_walker_screen'),
    },
    { label: "__separator__", icon: null, on_press: () => {} },
    {
      label: 'Ajustes',
      icon: <Feather name="settings" size={20} color="#000c14" />,
      on_press: () => navigation.navigate('settings_screen', { role: 'admin' }),
    },
    {
      label: 'Cerrar sesión',
      icon: <MaterialIcons name="logout" size={20} color="#000c14" />,
      on_press: async () => {
        await clear_session();
        navigation.reset({ index: 0, routes: [{ name: 'login' }] });
      },
    },
  ];

  return (
    <ScreenWithMenu
      role_id={1}
      menu_options={menu_options}
      on_search_press={() => navigation.navigate('user_screen')}
    >
      <View style={styles.card_container}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('user_screen')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo1.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('walks_screen')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo2.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Paseos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('payments_screen')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo3.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Pagos</Text>
        </TouchableOpacity>
      </View>
    </ScreenWithMenu>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_container: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#bbdefb",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  card_image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  card_title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#111",
    marginTop: 12,
    marginBottom: 6,
  },
});