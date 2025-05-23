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

const get_role_label = (role_id: number): string => {
  switch (role_id) {
    case 1: return 'Administrador';
    case 2: return 'Paseador';
    case 3: return 'Cliente';
    default: return 'Usuario';
  }
};

export interface menu_option {
  label: string;
  icon: React.ReactNode;
  on_press: () => void;
}

interface side_menu_props {
  visible: boolean;
  options: menu_option[];
  on_close: () => void;
  role_id: number;
  name?: string;
  profile_image?: ImageSourcePropType;
}

const { width: screen_width } = Dimensions.get('window');
const drawer_width = screen_width * 0.75;

export default function Side_menu({
  visible,
  options,
  on_close,
  role_id,
  name,
  profile_image,
}: side_menu_props) {
  const translate_x = useMemo(() => new Animated.Value(-drawer_width), []);

  useEffect(() => {
    Animated.timing(translate_x, {
      toValue: visible ? 0 : -drawer_width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const display_name = name ?? get_role_label(role_id);

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={on_close}
        />
      )}
      <Animated.View
        style={[
          styles.drawer,
          { width: drawer_width, transform: [{ translateX: translate_x }] },
        ]}
      >
        <View style={styles.menu_header}>
          <Image
            source={profile_image ?? require('../../assets/user_icon.png')}
            style={styles.header_avatar}
          />
          <Text style={styles.header_name}>{display_name}</Text>
        </View>

        <TouchableOpacity style={styles.close_btn} onPress={on_close}>
          <Text style={styles.close_txt}>×</Text>
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
                opt.on_press();
                on_close();
              }}
            >
              <View style={styles.icon_wrapper}>{opt.icon}</View>
              <Text style={styles.option_txt}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </>
  );
}

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
    backgroundColor: '#e3f2fd',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 8,
    zIndex: 11,
  },
  menu_header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  header_avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  header_name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000c14',
  },
  close_btn: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
  close_txt: {
    fontSize: 28,
    color: '#000c14',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  icon_wrapper: {
    marginRight: 12,
  },
  option_txt: {
    fontSize: 16,
    color: '#000c14',
  },
  separator: {
    height: 1,
    backgroundColor: '#000c14',
    marginVertical: 8,
    opacity: 0.6,
  },
});
