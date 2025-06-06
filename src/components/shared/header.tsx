// src/components/shared/header.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import NotificationCenter from "./notification_center";
import { use_auth } from "../../hooks/use_auth";

interface header_props {
  role_id: number;
  // Añadimos esta prop opcional:
  external_name?: string;
  on_search_press?: () => void;
  on_menu_press?: () => void;
}

const get_role_label = (role_id: number): string => {
  switch (role_id) {
    case 1:
      return "Administrador";
    case 2:
      return "Paseador";
    case 3:
      return "Cliente";
    default:
      return "Usuario";
  }
};

export default function Header({
  role_id,
  external_name, // lo recibimos aquí
  on_search_press,
  on_menu_press,
}: header_props) {
  const { user } = use_auth();

  // 1) Primero intentamos con external_name (walker_profile.name)
  // 2) Luego con user?.name (desde contexto de auth)
  // 3) Si ninguno existe, mostramos el label por rol
  const label = external_name || user?.name || get_role_label(role_id);

  const user_id = user?.id ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.user_info}>
        <Text style={styles.greeting}>Hola, {label}</Text>
      </View>

      <View style={styles.actions}>
        {user_id != null && <NotificationCenter userId={user_id} />}

        {on_menu_press && (
          <TouchableOpacity onPress={on_menu_press} style={styles.icon_btn}>
            <Image
              source={require("../../assets/menu_icon2.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  user_info: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon_btn: {
    marginLeft: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
