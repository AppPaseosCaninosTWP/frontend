import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import NotificationCenter from './notification_center';
import { get_user } from '../../utils/token_service';

interface header_props {
  role_id: number;
  name?: string;
  profile_image?: ImageSourcePropType;
  on_search_press?: () => void;
  on_menu_press?: () => void;
}

const get_role_label = (role_id: number): string => {
  switch (role_id) {
    case 1:
      return 'Administrador';
    case 2:
      return 'Paseador';
    case 3:
      return 'Cliente';
    default:
      return 'Usuario';
  }
};

export default function Header({
  role_id,
  name,
  profile_image,
  on_search_press,
  on_menu_press,
}: header_props) {
  const label = name ?? get_role_label(role_id);
  const handle_search = on_search_press ?? (() => {});
  const [user_id, set_user_id] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const u = await get_user();
      set_user_id(u?.id ?? null);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.user_info}>
        <Image
          source={profile_image ?? require('../../assets/user_icon.png')}
          style={styles.profile_image}
        />
        <Text style={styles.greeting}>Hola, {label}</Text>
      </View>

      <View style={styles.actions}>

        {user_id != null && (
          <NotificationCenter userId={user_id} />
        )}

        {on_menu_press && (
          <TouchableOpacity onPress={on_menu_press} style={styles.icon_btn}>
            <Image
              source={require('../../assets/menu_icon2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  user_info: ViewStyle;
  profile_image: ImageStyle;
  greeting: TextStyle;
  actions: ViewStyle;
  icon_btn: ViewStyle;
  icon: ImageStyle;
}>({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
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
  profile_image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_btn: {
    marginLeft: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
});