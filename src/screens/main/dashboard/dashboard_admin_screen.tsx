// src/screens/admin/DashboardAdminScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { user_model } from '../../../models/user_model';


import { get_user, clear_session } from '../../../utils/token_service';

export default function DashboardAdminScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const  [user, setUser] = useState<user_model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedUser = await get_user();
      // Si no hay usuario o no es admin (role_id !== 1), cerrar sesión
      if (!storedUser || storedUser.role_id !== 1) {
        await clear_session();
        Alert.alert('Acceso denegado', 'Debes iniciar sesión como administrador.');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header_container}>
        <Image
          source={require('../../../assets/user_icon.png')} 
          style={styles.profile_image}
        />
        <Text style={styles.header_text}>Hola, Administrador</Text>
        <View style={styles.icon_group}>
          <TouchableOpacity onPress={() => {/* busqueda */}}>
            <Image source={require('../../../assets/search_icon.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {/* menú */}}>
            <Image source={require('../../../assets/menu_icon.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard Tiles */}
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
          //onPress={() => navigation.navigate('')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo2.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Paseadores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          //onPress={() => navigation.navigate('')}
        >
          <Image
            source={require('../../../assets/admin/admin_photo3.png')}
            style={styles.card_image}
          />
          <Text style={styles.card_title}>Pagos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profile_image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  header_text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  icon_group: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  card_container: {
    flexDirection: 'column',
    gap: 16,
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
