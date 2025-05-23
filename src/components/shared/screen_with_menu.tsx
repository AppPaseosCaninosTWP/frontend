import React, { ReactNode, useState } from 'react';
import { View, ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import Header from '../../components/shared/header';
import Side_menu, { menu_option } from '../../components/shared/side_menu';

interface screen_with_menu_props {
  role_id: number;
  menu_options: menu_option[];
  children: ReactNode;
  name?: string;
  profile_image?: ImageSourcePropType;
  on_search_press?: () => void;
}

export default function Screen_with_menu({
  role_id,
  menu_options,
  children,
  name,
  profile_image,
  on_search_press,
}: screen_with_menu_props) {
  const [menu_visible, set_menu_visible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Header
        role_id={role_id}
        name={name}
        profile_image={profile_image}
        on_search_press={on_search_press}
        on_menu_press={() => set_menu_visible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        style={{ opacity: menu_visible ? 0 : 1 }}
      >
        {children}
      </ScrollView>

      <Side_menu
        visible={menu_visible}
        options={menu_options}
        role_id={role_id}
        on_close={() => set_menu_visible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, paddingTop: 20, paddingHorizontal: 20 },
});
