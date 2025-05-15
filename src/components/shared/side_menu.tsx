import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';

const getRoleLabel = (roleId: number): string => {
  switch (roleId) {
    case 1: return 'Administrador';
    case 2: return 'Paseador';
    case 3: return 'Cliente';
    default: return 'Usuario';
  }
};

export interface MenuOption {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface SideMenuProps {
  visible: boolean;
  options: MenuOption[];
  onClose: () => void;
  roleId: number;
  name?: string;
  profileImage?: ImageSourcePropType;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  options,
  onClose,
  roleId,
  name,
  profileImage,
}) => {
  const translateX = useMemo(() => new Animated.Value(-DRAWER_WIDTH), []);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const displayName = name ?? getRoleLabel(roleId);

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.drawer,
          { width: DRAWER_WIDTH, transform: [{ translateX }] },
        ]}
      >
       //Header del menú lateral
       <View style={styles.menuHeader}>
         <Image
           source={
             profileImage ?? require('../../assets/user_icon.png')
           }
           style={styles.headerAvatar}
         />
         <Text style={styles.headerName}>{displayName}</Text>
       </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeTxt}>×</Text>
        </TouchableOpacity>

        {options.map((opt, index) => {
          if (opt.label === '__separator__') {
             return <View key={`sep-${index}`} style={styles.separator} />;
          }

         return (
           <TouchableOpacity
             key={opt.label}
            style={styles.option}
            onPress={() => {
            opt.onPress();
          onClose();
        }}
    >
      <View style={styles.iconWrapper}>{opt.icon}</View>
      <Text style={styles.optionTxt}>{opt.label}</Text>
    </TouchableOpacity>
  );
})}

      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000c14',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 8,
    zIndex: 11,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
  closeTxt: {
    fontSize: 28,
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrapper: {
    marginRight: 12,
  },
  optionTxt: {
    fontSize: 16,
    color: '#fff',
  },
  separator: {
  height: 1,
  backgroundColor: '#D1D5DB', // Gris suave
  marginVertical: 8,
  opacity: 0.6,
},

});

export default SideMenu;
