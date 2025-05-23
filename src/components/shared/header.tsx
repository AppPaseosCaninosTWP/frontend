// src/components/shared/Header.tsx
import React, { useState, useEffect } from 'react';
import NotificationCenter from './notification_center';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { get_user } from '../../utils/token_service';

interface HeaderProps {
  roleId: number;
  name?: string;
  profileImage?: ImageSourcePropType;
  onMenuPress?: () => void;
}

const getRoleLabel = (roleId: number): string => {
  switch (roleId) {
    case 1: return 'Administrador';
    case 2: return 'Paseador';
    case 3: return 'Cliente';
    default: return 'Usuario';
  }
};

const Header: React.FC<HeaderProps> = ({
  roleId,
  name,
  profileImage,
  onMenuPress,
}) => {
  const label = name ?? getRoleLabel(roleId);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const u = await get_user();
      setUserId(u?.id ?? null);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={profileImage ?? require('../../assets/user_icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>Hola, {label}</Text>
      </View>

      <View style={styles.actions}>
        {/* Notis */}
        {userId != null && (
          <NotificationCenter userId={userId} />
        )}

        {/* Menu */}
        {onMenuPress && (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
            <Image
              source={require('../../assets/menu_icon2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
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
  iconBtn: {
    marginLeft: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default Header;
