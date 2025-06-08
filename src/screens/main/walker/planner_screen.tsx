// PLANNER SCREEN

//Importaciones y dependencias
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

//Modelos y servicios
import type { assigned_walk_model } from "../../../models/assigned_walk_model";
import { get_assigned_walks } from "../../../service/planner_service";
//Obtener el ancho de la pantalla para calcular el ancho de las tarjetas
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;

export default function PlannerScreen() {
  // Navegación
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estados para manejar la carga y los paseos asignados
  const [loading, set_loading] = useState<boolean>(false);
  const [walks, set_walks] = useState<assigned_walk_model[]>([]);

  //Efecto que se ejecuta al montar la pantalla
  //Llama al servicio para obtener los paseos asignados
  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        const assigned_walks = await get_assigned_walks();
        set_walks(assigned_walks);
      } catch (err: any) {
        Alert.alert("Error cargando paseos", err.message);
      } finally {
        set_loading(false);
      }
    })();
  }, []);

  //Funcion que muestra cada paseo asignado en una tarjeta
  //Al pulsar navega a PetProfileScreen con los parámetros walkId, petId, duration.
  const render_item = ({ item }: { item: assigned_walk_model }) => (
    <TouchableOpacity
      style={styles.card_wrapper}
      onPress={() =>
        navigation.navigate("pet_profile_screen", {
          walkId: item.walk_id,
          petId: item.pet_id,
          duration: item.duration,
        })
      }
    >
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        {/*Mostrar nombre de la mascota y detalles*/}
        <View style={styles.text_container}>
          <Text style={styles.pet_name}>{item.pet_name}</Text>
          <Text style={styles.details}>
            {item.zone} · {item.date} · {item.time}
          </Text>
        </View>

        {/*Imagen de la mascota o icono por defecto*/}
        {item.pet_photo ? (
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.pet_photo}`,
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
    </TouchableOpacity>
  );

  //Renderizado de la pantalla
  return (
    <View style={styles.wrapper}>
      <View style={styles.back_header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screen_title}>Agenda</Text>
      </View>

      {/*Contador de paseos asignados*/}
      <Text style={styles.header}>
        Mis paseos: <Text style={styles.badge}>{walks.length}</Text>
      </Text>

      {/*Muestra un indicador de carga mientras se obtienen los paseos*/}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={walks}
          keyExtractor={(w) => w.walk_id.toString()}
          renderItem={render_item}
          contentContainerStyle={styles.list_content}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

//Estilos para la pantalla
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  back_header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
  },
  screen_title: {
    textAlign: "center",
    flex: 1,
    marginRight: 50,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  header: {
    marginTop: 16,
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
    fontSize: 18,
    fontWeight: "600",
  },
  list_content: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  card_wrapper: {
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  card: {
    borderRadius: 20,
    height: 120,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  text_container: {
    flex: 1,
  },
  pet_name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  details: {
    color: "#D0E7FF",
    fontSize: 14,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
});
