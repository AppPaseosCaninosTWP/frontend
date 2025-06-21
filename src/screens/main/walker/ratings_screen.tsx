// WALKER RATINGS SCREEN
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

import { get_user } from "../../../utils/token_service";
import type { walk_model } from "../../../models/walk_model";
import { get_walk_history } from "../../../service/walk_service";

import {
  create_rating,
  get_user_ratings,
  RatingItem,
  UserRatingsResponse,
} from "../../../service/rating_service";

import { RatingModal } from "../../../components/shared/rating/rating_modal";
import { LinearGradient } from "expo-linear-gradient";

export default function WalkerRatingsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [active_tab, set_active_tab] = useState<"rate_pet" | "my_ratings">(
    "rate_pet"
  );
  const [to_rate, set_to_rate] = useState<walk_model[]>([]);
  const [my_ratings, set_my_ratings] = useState<RatingItem[]>([]);
  const [loading, set_loading] = useState(true);
  const [show_modal, set_show_modal] = useState(false);
  const [selected_walk, set_selected_walk] = useState<walk_model | null>(null);

  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        const me = await get_user();
        if (!me?.id) throw new Error("Sesión no válida");

        if (active_tab === "rate_pet") {
          const history = await get_walk_history();
          const pendientes = history.filter(
            (w) => w.walker_id === me.id && !w.is_rated
          );
          set_to_rate(pendientes);
        } else {
          const resp: UserRatingsResponse = await get_user_ratings(me.id);
          set_my_ratings(resp.ratings);
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    })();
  }, [active_tab]);

  const handle_submit = async (value: number, comment: string) => {
    if (!selected_walk) return;

    try {
      await create_rating({
        walk_id: selected_walk.walk_id,
        receiver_id: selected_walk.pet_id,
        value,
        comment,
      });

      set_to_rate((prev) =>
        prev.filter((w) => w.walk_id !== selected_walk.walk_id)
      );

      set_show_modal(false);
      Alert.alert("¡Gracias!", "Tu calificación ha sido enviada.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const render_to_rate = ({ item }: { item: walk_model }) => (
    <View style={styles.card_wrapper}>
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <MaterialCommunityIcons
          name="dog"
          size={32}
          color="#fff"
          style={{ marginHorizontal: 12 }}
        />
        <View style={styles.text_container}>
          <Text style={styles.pet_name}>{item.pet_name}</Text>
          <Text style={styles.details}>
            {item.time} · {item.sector} · {item.date}
          </Text>
          <Text style={styles.duration}>Duración: {item.duration} min</Text>
          <TouchableOpacity
            style={styles.rate_button}
            onPress={() => {
              set_selected_walk(item);
              set_show_modal(true);
            }}
          >
            <Text style={styles.rate_button_text}>Calificar</Text>
          </TouchableOpacity>
        </View>
        {item.photo_url ? (
          <Image source={{ uri: item.photo_url }} style={styles.pet_image} />
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
  );

  const render_my_rating = ({ item }: { item: RatingItem }) => (
    <View style={styles.card_wrapper}>
      <View style={[styles.card, { backgroundColor: "#f1f5f9" }]}>
        <View style={styles.text_container}>
          <Text style={[styles.pet_name, { color: "#333" }]}>
            Paseo #{item.walk_id}
          </Text>
          <Text>Calificación: {item.value} ★</Text>
          <Text>Comentario: {item.comment}</Text>
          <Text style={styles.small_text}>
            Fecha: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.back_header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screen_title}>Calificaciones</Text>
      </View>

      <View style={styles.tab_container}>
        {["rate_pet", "my_ratings"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab_button,
              active_tab === tab && styles.tab_button_active,
            ]}
            onPress={() => set_active_tab(tab as "rate_pet" | "my_ratings")}
          >
            <Text
              style={[
                styles.tab_text,
                active_tab === tab && styles.tab_text_active,
              ]}
            >
              {tab === "rate_pet" ? "Calificar mascota" : "Mis calificaciones"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {active_tab === "rate_pet" ? (
        <FlatList
          data={to_rate}
          keyExtractor={(item) =>
            item?.walk_id?.toString() ?? Math.random().toString()
          }
          renderItem={render_to_rate}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No hay mascotas por calificar.
            </Text>
          }
        />
      ) : (
        <FlatList
          data={my_ratings}
          keyExtractor={(item) =>
            item?.id?.toString() ?? Math.random().toString()
          }
          renderItem={render_my_rating}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Aún no has recibido calificaciones.
            </Text>
          }
        />
      )}

      {selected_walk && (
        <RatingModal
          visible={show_modal}
          on_close={() => set_show_modal(false)}
          on_submit={handle_submit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  tab_container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
    paddingHorizontal: 16,
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
  card_wrapper: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  text_container: { flex: 1 },
  pet_name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#fff",
  },
  details: {
    color: "#D0E7FF",
    fontSize: 14,
  },
  duration: {
    color: "#D0E7FF",
    fontSize: 14,
    marginTop: 4,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
  rate_button: {
    marginTop: 8,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  rate_button_text: {
    color: "#007BFF",
    fontWeight: "600",
  },
  small_text: { fontSize: 12, color: "#666", marginTop: 4 },
  back_header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  screen_title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    marginRight: 24,
    color: "#111",
  },
});
