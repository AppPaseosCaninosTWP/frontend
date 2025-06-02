import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import { LinearGradient } from "expo-linear-gradient";
import { get_token, get_user } from "../../../utils/token_service";

import Screen_with_menu from "../../../components/shared/screen_with_menu";
import type { menu_option } from "../../../components/shared/side_menu";

const { width: screen_width } = Dimensions.get("window");
const card_width = screen_width - 40;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface WalkerProfileResponse {
  walker_id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  walker_type: string;
  zone: string;
  description: string;
  balance: number;
  on_review: boolean;
  photo_url: string;
}

interface AssignedWalk {
  walk_id: number;
  pet_id: number;
  pet_name: string;
  pet_photo: string;
  zone: string;
  time: string;
  date: string;
}

export default function Dashboard_paseador_screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active_index, set_active_index] = useState<number>(0);
  const [assigned_walks, set_assigned_walks] = useState<AssignedWalk[]>([]);
  const [loading, set_loading] = useState<boolean>(false);
  const [walker_balance, set_walker_balance] = useState<number | null>(null);
  const [walker_profile, set_walker_profile] =
    useState<WalkerProfileResponse | null>(null);
  const is_focused = useIsFocused();

  const fetch_assigned = async () => {
    set_loading(true);
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data, error, msg } = await res.json();
      if (error) throw new Error(msg);
      set_assigned_walks(data);
    } catch (err: any) {
      Alert.alert("Error al cargar paseos", err.message);
    } finally {
      set_loading(false);
    }
  };

  const fetch_profile_and_balance = async () => {
    try {
      const token = await get_token();
      const user = await get_user();
      if (!token || !user?.id) throw new Error("Sesión no válida");

      const res = await fetch(
        `${API_BASE_URL}/walker_profile/get_profile/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Error cargando perfil:", text);
        throw new Error(`Error ${res.status}`);
      }
      const { data, error, msg } = await res.json();
      if (error) throw new Error(msg);

      set_walker_profile(data);
      set_walker_balance(data.balance);
    } catch (err: any) {
      console.error("Error en fetch_profile_and_balance:", err.message);
    }
  };

  useEffect(() => {
    if (is_focused) {
      fetch_assigned();
      fetch_profile_and_balance();
    }
  }, [is_focused]);

  const menu_options: menu_option[] = [
    {
      label: "Menu Principal",
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

  const on_scroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / card_width);
    set_active_index(idx);
  };

  const profile_image_url = walker_profile?.photo_url
    ? walker_profile.photo_url.startsWith("http")
      ? walker_profile.photo_url
      : `${API_BASE_URL.replace(/\/$/, "")}/uploads/${walker_profile.photo_url}`
    : null;

  return (
    <Screen_with_menu
      role_id={2}
      menu_options={menu_options}
      name={walker_profile?.name}
      profile_image={
        profile_image_url
          ? { uri: profile_image_url }
          : require("../../../assets/user_icon.png")
      }
    >
      <TouchableOpacity
        style={styles.balance_section}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("payments_walker_screen")}
      >
        <LinearGradient
          colors={["#00AFFF", "#5ADFDE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balance_card}
        >
          <Feather
            name="credit-card"
            size={24}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <View style={styles.balance_text_container}>
            <Text style={styles.balance_label}>Saldo disponible</Text>
            <Text style={styles.balance_amount}>
              {walker_balance != null
                ? walker_balance.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 2,
                  })
                : "—"}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.section_title}>
        Tu próximo paseo:{" "}
        <Text style={styles.badge}>{assigned_walks.length}</Text> paseo(s)
        asignado(s)
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.carousel_container}>
          <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={on_scroll}
            scrollEventThrottle={16}
          >
            {assigned_walks.map((walk, i) => (
              <View
                key={walk.walk_id}
                style={{
                  width: card_width,
                  marginRight: i < assigned_walks.length - 1 ? 16 : 0,
                }}
              >
                <LinearGradient
                  colors={["#00AFFF", "#5ADFDE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.walk_card}
                >
                  <View style={styles.walk_text}>
                    <Text style={styles.pet_name}>{walk.pet_name}</Text>
                    <Text style={styles.detail}>
                      {walk.zone} | {walk.time}
                    </Text>
                  </View>
                  {walk.pet_photo ? (
                    <Image
                      source={{
                        uri: `${API_BASE_URL}/uploads/${walk.pet_photo}`,
                      }}
                      style={styles.pet_image}
                    />
                  ) : (
                    <Feather
                      name="user"
                      size={80}
                      color="#fff"
                      style={{ marginLeft: 12 }}
                    />
                  )}
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {assigned_walks.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === active_index && styles.active_dot]}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AvailableWalksScreen")}
        >
          <Feather name="map" size={40} color="#007BFF" />
          <Text style={styles.card_title}>Buscar paseo</Text>
          <Text style={styles.card_text}>
            Explora paseos publicados por clientes y acepta los que se adapten a
            tu zona y disponibilidad.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PlannerScreen")}
        >
          <Image
            source={require("../../../assets/plate_icon.png")}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Mi agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("WalkHistoryScreen")}
        >
          <Image
            source={require("../../../assets/admin/admin_photo2.png")}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("RatingsScreen")}
        >
          <Image
            source={require("../../../assets/admin/admin_photo1.png")}
            style={styles.icon}
          />
          <Text style={styles.card_title}>Calificaciones</Text>
        </TouchableOpacity>
      </View>
    </Screen_with_menu>
  );
}

const styles = StyleSheet.create({
  balance_section: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  balance_card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  balance_text_container: {
    flex: 1,
  },
  balance_label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  balance_amount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
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
  carousel_container: {
    flex: 1,
    marginBottom: 24,
  },
  walk_card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 120,
  },
  walk_text: {
    flex: 1,
  },
  pet_name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  detail: {
    color: "#D0E7FF",
    fontSize: 18,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  active_dot: {
    backgroundColor: "#007BFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  card: {
    width: "48%",
    backgroundColor: "#A8F5FD",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  card_title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#111",
    marginTop: 12,
    marginBottom: 6,
  },
  card_text: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  icon: {
    width: 130,
    height: 130,
    marginBottom: 12,
    borderRadius: 16,
  },
});
