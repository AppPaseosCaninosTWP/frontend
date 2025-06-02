import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { get_token } from "../../../utils/token_service";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface BackendWalk {
  walk_id: number;
  walk_type: string;
  status: string;
  client_email: string;
  walker_email: string | null;
  days: Array<{
    start_date: string;
    start_time: string;
    duration: number;
  }>;
  pet_id: number;
  pet_name: string;
  pet_photo: string | null;
}

export default function AvailableWalksScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [all_walks, set_all_walks] = useState<BackendWalk[]>([]);
  const [loading, set_loading] = useState(false);
  const [selected_tab, set_selected_tab] = useState<"Fijo" | "Esporádico">(
    "Fijo"
  );

  useEffect(() => {
    fetch_walks();
  }, []);

  const fetch_walks = async () => {
    set_loading(true);
    try {
      const token = await get_token();

      const res = await fetch(`${API_BASE_URL}/walk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const { data: lista, error: err, msg } = json;
      if (err) throw new Error(msg);

      const detalles_con_mascota: BackendWalk[] = await Promise.all(
        lista.map(async (w: any) => {
          const detalle_res = await fetch(`${API_BASE_URL}/walk/${w.walk_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!detalle_res.ok)
            throw new Error(`Detalle HTTP ${detalle_res.status}`);
          const detalle_json = await detalle_res.json();
          const { data: walk_detail, error: err2, msg: msg2 } = detalle_json;
          if (err2) throw new Error(msg2);

          const pet_data =
            Array.isArray(walk_detail.pets) && walk_detail.pets.length > 0
              ? walk_detail.pets[0]
              : { pet_id: 0, name: "Sin mascota", photo: null };

          const pet_photo_url = pet_data.photo
            ? `${API_BASE_URL}/uploads/${pet_data.photo}`
            : null;

          return {
            walk_id: w.walk_id,
            walk_type: w.walk_type,
            status: w.status,
            client_email: w.client_email,
            walker_email: w.walker_email,
            days: w.days,
            pet_id: pet_data.pet_id,
            pet_name: pet_data.name,
            pet_photo: pet_photo_url,
          };
        })
      );

      set_all_walks(detalles_con_mascota);
    } catch (err: any) {
      Alert.alert("Error al cargar paseos", err.message);
    } finally {
      set_loading(false);
    }
  };

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const walks_to_show = all_walks
    .filter((w) => w.status === "pendiente")
    .filter((w) => normalize(w.walk_type) === normalize(selected_tab));

  const render_item = ({ item }: { item: BackendWalk }) => {
    const first_day = item.days[0] || {
      start_date: "",
      start_time: "",
      duration: 0,
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate("PetProfileScreen", {
            walkId: item.walk_id,
            petId: item.pet_id,
            duration: first_day.duration,
          });
        }}
      >
        <View style={styles.card_header}>
          {item.pet_photo ? (
            <Image
              source={{ uri: item.pet_photo }}
              style={styles.avatar}
              onError={() =>
                console.warn("Error cargando imagen:", item.pet_photo)
              }
            />
          ) : (
            <Feather name="user" size={48} color="#ccc" style={styles.avatar} />
          )}

          <View style={styles.info}>
            <Text style={styles.name}>{item.pet_name}</Text>

            <Text style={styles.meta}>
              {`Paseo ${item.walk_type}  |  ${first_day.start_time}  |  ${first_day.start_date}`}
            </Text>

            <Text style={[styles.meta, styles.client_email]}>
              {item.client_email}
            </Text>

            <Text style={[styles.meta, styles.status_text]}>
              {`Estado: ${item.status}`}
            </Text>
          </View>

          <Feather name="chevron-right" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header_title}>Paseos disponibles</Text>
      </View>

      <View style={styles.tab_container}>
        {(["Fijo", "Esporádico"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab_button,
              selected_tab === tab && styles.tab_button_active,
            ]}
            onPress={() => set_selected_tab(tab)}
          >
            <Text
              style={[
                styles.tab_text,
                selected_tab === tab && styles.tab_text_active,
              ]}
            >
              Paseos {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.activity_indicator} />
      ) : (
        <FlatList
          data={walks_to_show}
          keyExtractor={(w) => w.walk_id.toString()}
          renderItem={render_item}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty_text}>
              No hay paseos {selected_tab.toLowerCase()} disponibles
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header_title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 0.9,
    color: "#111",
  },

  tab_container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  tab_button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  tab_button_active: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tab_text: { fontSize: 14, color: "#555" },
  tab_text_active: { color: "#fff", fontWeight: "600" },

  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  empty_text: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card_header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  meta: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },
  client_email: {
    marginTop: 6,
    fontSize: 12,
  },
  status_text: {
    marginTop: 4,
  },
  activity_indicator: {
    marginTop: 20,
  },
});
