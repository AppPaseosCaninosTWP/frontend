// src/components/shared/header.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface HeaderProps {
  /** roleId: 1=Administrador, 2=Paseador, 3=Cliente */
  roleId: number;
  /** Nombre personalizado (si se quiere mostrar en lugar del rol) */
  name?: string;
  /** Imagen de perfil opcional */
  profileImage?: ImageSourcePropType;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

// Mapea roleId a texto legible
const getRoleLabel = (roleId: number): string => {
  switch (roleId) {
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

const Header: React.FC<HeaderProps> = ({
  roleId,
  name,
  profileImage,
  onSearchPress,
  onMenuPress,
}) => {
  // Si name está presente, lo usamos; si no, usamos label de rol
  const displayName = name ? `Hola, ${name}` : `Hola, ${getRoleLabel(roleId)}`;

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={profileImage ?? require('../../assets/user_icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>{displayName}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onSearchPress}>
          <Image
            source={require('../../assets/search_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Image
            source={require('../../assets/menu_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 1,
    paddingTop: 5,
    paddingBottom: 30,
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
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  greeting: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  menuButton: {
    marginLeft: 8,
  },
});

export default Header;
