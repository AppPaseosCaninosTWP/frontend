// src/screens/walker/dashboard_paseador_screen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

import Screen_with_menu from "../../../components/shared/screen_with_menu";
import BalanceCard from "../../../components/shared/balance_card";
import WalkCarousel from "../../../components/shared/walk_carousel";
import HomeGridCard from "../../../components/shared/home_grid_card";

import { get_assigned_walks } from "../../../service/walk_service";
import { get_walker_profile } from "../../../service/walker_service";
import type { walk_model } from "../../../models/walk_model";
import type { walker_model } from "../../../models/walker_model";

const { width: screen_width } = Dimensions.get("window");

export default function DashboardPaseadorScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [assigned_walks, set_assigned_walks] = useState<walk_model[]>([]);
  const [loading, set_loading] = useState(false);
  const [walker_balance, set_walker_balance] = useState<number | null>(null);
  const [walker_profile, set_walker_profile] = useState<walker_model | null>(
    null
  );
  const is_focused = useIsFocused();

  const fetch_assigned = async () => {
    set_loading(true);
    try {
      const data = await get_assigned_walks();
      set_assigned_walks(data);
    } catch (err: any) {
      Alert.alert("Error al cargar paseos", err.message);
    } finally {
      set_loading(false);
    }
  };

  const fetch_profile_and_balance = async () => {
    try {
      const perfil = await get_walker_profile();
      set_walker_profile(perfil);
      set_walker_balance(perfil.balance);
    } catch (err: any) {
      console.error("Error fetch profile:", err.message);
    }
  };

  useEffect(() => {
    if (is_focused) {
      fetch_assigned();
      fetch_profile_and_balance();
    }
  }, [is_focused]);

  const menu_options = [
    {
      label: "Menú Principal",
      icon: <Feather name="layout" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("DashboardPaseador"),
    },
    {
      label: "Buscar Paseos",
      icon: <Ionicons name="search" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("AvailableWalksScreen"),
    },
    {
      label: "Calendario",
      icon: <MaterialIcons name="calendar-today" size={20} color="#000c14" />,
      on_press: () => Alert.alert("Calendario"),
    },
    { label: "__separator__", icon: null, on_press: () => {} },
    {
      label: "Perfil",
      icon: <Ionicons name="person-circle" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("WalkerProfileScreen"),
    },
    {
      label: "Calificaciones",
      icon: <Ionicons name="star" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("RatingsScreen"),
    },
    {
      label: "Billetera",
      icon: <Feather name="credit-card" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("payments_walker_screen"),
    },
    {
      label: "Ajustes",
      icon: <Feather name="settings" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("settings_walker"),
    },
  ];

  const profile_image_url = walker_profile?.photo_url
    ? walker_profile.photo_url.startsWith("http")
      ? walker_profile.photo_url
      : `${process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "")}/uploads/${
          walker_profile.photo_url
        }`
    : null;

  return (
    <Screen_with_menu
      role_id={2}
      menu_options={menu_options}
      on_search_press={() => {
        /* si necesitas búsqueda */
      }}
      // aquí le pasamos el nombre del paseador al Header
      external_name={walker_profile?.name}
    >
      <BalanceCard
        balance={walker_balance}
        on_press={() => navigation.navigate("payments_walker_screen")}
      />

      <Text style={styles.section_title}>
        Tu próximo paseo:{" "}
        <Text style={styles.badge}>{assigned_walks.length}</Text> paseo(s)
        asignado(s)
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <WalkCarousel
          assigned_walks={assigned_walks}
          container_width={screen_width}
        />
      )}

      <View style={styles.grid}>
        <HomeGridCard
          icon={<Feather name="map" size={40} color="#007BFF" />}
          title="Buscar paseo"
          description="Explora paseos publicados por clientes y acepta los que se adapten a tu zona y disponibilidad."
          on_press={() => navigation.navigate("AvailableWalksScreen")}
        />

        <HomeGridCard
          icon={
            <Image
              source={require("../../../assets/plate_icon.png")}
              style={styles.icon}
            />
          }
          title="Mi agenda"
          on_press={() => navigation.navigate("PlannerScreen")}
        />

        <HomeGridCard
          icon={
            <Image
              source={require("../../../assets/admin/admin_photo2.png")}
              style={styles.icon}
            />
          }
          title="Historial"
          on_press={() => navigation.navigate("WalkHistoryScreen")}
        />

        <HomeGridCard
          icon={
            <Image
              source={require("../../../assets/admin/admin_photo1.png")}
              style={styles.icon}
            />
          }
          title="Calificaciones"
          on_press={() => navigation.navigate("RatingsScreen")}
        />
      </View>
    </Screen_with_menu>
  );
}

const styles = StyleSheet.create({
  section_title: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E6F4FF",
    color: "#007BFF",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  icon: {
    width: 130,
    height: 130,
    marginBottom: 12,
    borderRadius: 16,
  },
});
