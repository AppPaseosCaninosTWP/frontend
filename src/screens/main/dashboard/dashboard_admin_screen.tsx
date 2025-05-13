// src/screens/admin/DashboardAdminScreen.tsx

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
import type { MenuOption } from '../../../components/shared/side_menu';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function DashboardAdminScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<user_model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedUser = await get_user();
      if (!storedUser || storedUser.role_id !== 1) {
        await clear_session();
        Alert.alert(
          'Acceso denegado',
          'Debes iniciar sesión como administrador.'
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }
      setUser(storedUser);
      setLoading(false);
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

  // Opciones del menú lateral
  const menuOptions: MenuOption[] = [
    {
      label: 'Dashboard',
      icon: <Feather name="layout" size={20} color="#fff" />,
      onPress: () => navigation.navigate('DashboardAdmin'),
    },
    {
      label: 'Usuarios',
      icon: <Ionicons name="people" size={20} color="#fff" />,
      onPress: () => navigation.navigate('UserScreen'),
    },
    {
      label: 'Calendario Global',
      icon: <MaterialIcons name="calendar-today" size={20} color="#fff" />,
      onPress: () => Alert.alert('Calendario'), //momentaneo hasta que se implemente
    },
    {
      label: 'Pagos',
      icon: <MaterialIcons name="payment" size={20} color="#fff" />,
      onPress: () => Alert.alert('Pagos'), //momentaneo hasta que se implemente
    },
    {
      label: 'Cuenta',
      icon: <Ionicons name="person-circle" size={20} color="#fff" />,
      onPress: () => Alert.alert('Cuenta'), //momentaneo hasta que se implemente
    },
    {
      label: 'Calificaciones',
      icon: <Ionicons name="star" size={20} color="#fff" />,
      onPress: () => Alert.alert('Calificaciones'), //momentaneo hasta que se implemente
    },
    {
      label: 'Ajustes',
      icon: <Feather name="settings" size={20} color="#fff" />,
      onPress: () => Alert.alert('Ajustes'), //momentaneo hasta que se implemente
    },
    {
      label: 'Cerrar sesión',
      icon: <MaterialIcons name="logout" size={20} color="#fff" />,
      onPress: async () => {
        await clear_session();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      },
    },
  ];

  return (
    <ScreenWithMenu
      roleId={1}
      menuOptions={menuOptions}
      onSearchPress={() => navigation.navigate('UserScreen')}
    >
      <View style={styles.card_container}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('UserScreen')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo1.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          // onPress={() => navigation.navigate('WalkersList')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo2.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Paseadores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          // onPress={() => navigation.navigate('Payments')}
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
    marginTop: 20, // separa un poco del Header
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  card_image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  card_title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
