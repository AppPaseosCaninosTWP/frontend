import React, { ReactNode, useState } from 'react';
import { View, ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import Header from '../../components/shared/header';
import SideMenu, { MenuOption } from '../../components/shared/side_menu';

interface ScreenWithMenuProps {
  roleId: number;
  menuOptions: MenuOption[];
  children: ReactNode;
  name?: string;
  profileImage?: ImageSourcePropType;
  onSearchPress?: () => void;
}

export default function ScreenWithMenu({
  roleId,
  menuOptions,
  children,
  name,
  profileImage,
  onSearchPress,
}: ScreenWithMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Header
        roleId={roleId}
        name={name}
        profileImage={profileImage}
        onSearchPress={onSearchPress}
        onMenuPress={() => setMenuVisible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        style={{ opacity: menuVisible ? 0 : 1 }}
      >
        {children}
      </ScrollView>

      <SideMenu
        visible={menuVisible}
        options={menuOptions}
        roleId={roleId}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, paddingTop: 20, paddingHorizontal: 20 },
});