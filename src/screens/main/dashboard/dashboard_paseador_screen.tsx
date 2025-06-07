// DASHBOARD PASEADOR SCREEN

//importaciones y dependencias
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

//Componentes
import Screen_with_menu from "../../../components/shared/screen_with_menu";
import BalanceCard from "../../../components/shared/balance_card";
import WalkCarousel from "../../../components/shared/walk_carousel";
import HomeGridCard from "../../../components/shared/home_grid_card";

//Servicios para obtener datos backend
import { get_assigned_walks } from "../../../service/walk_service";
import { get_walker_profile } from "../../../service/walker_service";
//Modelos
import type { walk_model } from "../../../models/walk_model";
import type { walker_model } from "../../../models/walker_model";

//Obtiene el ancho de la pantalla para el carrusel
const { width: screen_width } = Dimensions.get("window");

export default function DashboardPaseadorScreen() {
  //navegacion
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  //Estados
  const [assigned_walks, set_assigned_walks] = useState<walk_model[]>([]);
  const [loading, set_loading] = useState(false);
  const [walker_balance, set_walker_balance] = useState<number | null>(null);
  const [walker_profile, set_walker_profile] = useState<walker_model | null>(
    null
  );
  //Reactiva la pantalla
  const is_focused = useIsFocused();

  //Funcion carga paseos asignados desde el servicio
  //Maneja loading y errores
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

  //Funcion obtiene el perfil del paseador y su balance
  const fetch_profile_and_balance = async () => {
    try {
      const perfil = await get_walker_profile();
      set_walker_profile(perfil);
      set_walker_balance(perfil.balance);
    } catch (err: any) {
      console.error("Error fetch profile:", err.message);
    }
  };

  //La pantalla se reactiva cuando el usuario vuelve a la pantalla
  //Garantiza datos siempre actualizados
  useEffect(() => {
    if (is_focused) {
      fetch_assigned();
      fetch_profile_and_balance();
    }
  }, [is_focused]);

  //Define las opciones del menú lateral (etiqueta, icono y acción al presionar)
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

  return (
    //Screen_with_menu es un componente que envuelve UI y añade heaeder y side_menu
    <Screen_with_menu
      role_id={2}
      menu_options={menu_options}
      external_name={walker_profile?.name}
    >
      {/*Tarjeta de balance del paseador*/}
      <BalanceCard
        balance={walker_balance}
        on_press={() => navigation.navigate("payments_walker_screen")}
      />

      {/*Titulo de prox paseo*/}
      <Text style={styles.section_title}>
        Tu próximo paseo:{" "}
        <Text style={styles.badge}>{assigned_walks.length}</Text> paseo(s)
        asignado(s)
      </Text>

      {/*Caarrusel de paseos (o indicar cargando)*/}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <WalkCarousel
          assigned_walks={assigned_walks}
          container_width={screen_width}
        />
      )}

      {/*Casillas de acceso rapido*/}
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

//Estilos
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
