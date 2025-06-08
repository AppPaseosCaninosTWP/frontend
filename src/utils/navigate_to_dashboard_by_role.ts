import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/stack_navigator';

export function navigate_to_dashboard_by_role(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role_id: number
): void {
  switch (role_id) {
    case 1:
      navigation.replace('dashboard_admin');
      break;
    case 2:
      navigation.replace('dashboard_paseador');
      break;
    case 3:
      navigation.replace('dashboard_cliente');
      break;
    default:
      throw new Error(`Rol no reconocido: ${role_id}`);
  }
}
