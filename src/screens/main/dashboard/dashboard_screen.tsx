import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get_user, clear_session } from '../../../utils/token_service';
import type { user_model } from '../../../models/user_model';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';
import { navigate_to_dashboard_by_role } from '../../../utils/navigate_to_dashboard_by_role';

export default function Dashboard_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await get_user() as user_model;

        if (!user) throw new Error('Sesión no encontrada');

        console.log('ROLE_ID DEL USUARIO:', user.role_id);
        navigate_to_dashboard_by_role(navigation, user.role_id);
      } catch (err: any) {
        console.error('Error al cargar dashboard:', err.message);
        await clear_session();
        Alert.alert('Error', err.message || 'No se pudo cargar la sesión');
      } finally {
        set_is_loading(false);
      }
    };

    init();
  }, []);

  if (is_loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
