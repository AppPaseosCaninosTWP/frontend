import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get_user } from '../../../utils/token_service';
import type { user_model } from '../../../models/user_model';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

export default function Dashboard_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await get_user() as user_model;
        console.log('Usuario recuperado:', user);

        if (!user) {
          Alert.alert('Error', 'Sesión no encontrada');
          navigation.replace('Login');
          return;
        }

        switch (user.role_id) {
          case 1:
            navigation.replace('DashboardAdmin');
            break;
          case 2:
            navigation.replace('DashboardPaseador');
            break;
          case 3:
            navigation.replace('DashboardCliente');
            break;
          default:
            Alert.alert('Error', 'Rol no reconocido');
            navigation.replace('Login');
        }
      } catch (err) {
        Alert.alert('Error', 'No se pudo cargar la sesión');
        navigation.replace('Login');
      } finally {
        set_is_loading(false);
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
