import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { get_all_walks } from "../../../../service/walk_service";
import type { walk_model } from "../../../../models/walk_model";
import { Feather } from "@expo/vector-icons";
import { RatingModal } from "../../../../components/shared/rating/rating_modal";
import { create_rating } from "../../../../service/rating_service";
const API_UPLOADS_URL = process.env.EXPO_PUBLIC_URL;

export default function WalkHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [walks, set_walks] = useState<walk_model[]>([]);
  const [loading, set_loading] = useState(true);
  const [show_rating_modal, set_show_rating_modal] = useState(false);
  const [selected_walk, set_selected_walk] = useState<walk_model | null>(null);

  useEffect(() => {
    const fetch_walks = async () => {
      try {
        const data = await get_all_walks();
        set_walks(data);
        const walk_to_rate = data.find(
          (w) => w.status === "finalizado" && w.payment_status === "pagado" && !w.is_rated
        );
        if (walk_to_rate) {
          set_selected_walk(walk_to_rate);
          set_show_rating_modal(true);
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };
    fetch_walks();
  }, []);

  const handle_submit_rating = async (rating: number, comment: string) => {
    if (!selected_walk || !selected_walk.walk_id || !selected_walk.walker_id) {
      Alert.alert("Error", "Datos del paseo incompletos.");
      return;
    }

    try {
      await create_rating({
        walk_id: selected_walk.walk_id,
        receiver_id: selected_walk.walker_id,
        value: rating,
        comment,
      });

      set_walks((prev) =>
        prev.map((w) =>
          w.walk_id === selected_walk.walk_id ? { ...w, is_rated: true } : w
        )
      );

      set_show_rating_modal(false);
      Alert.alert("¡Gracias!", "Tu calificación fue enviada exitosamente.");
    } catch (err: any) {
      Alert.alert("Error", "No se pudo enviar la calificación.");
    }
  };



  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header_row}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.header_title}>Historial de Paseos</Text>
        </View>
        {walks.length === 0 ? (
          <Text style={styles.empty_text}>Aún no tienes paseos registrados.</Text>
        ) : (
          walks.map((w) => (
            <View key={w.walk_id} style={styles.card}>
              <View style={styles.row}>
                {w.pet_photo ? (
                  <Image
                    source={{ uri: `${API_UPLOADS_URL}/api/uploads/${w.pet_photo}` }}
                    style={styles.avatar}
                    onError={() => console.log("Error al cargar image:", w.pet_photo)}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.pet_name}>{w.pet_name}</Text>
                  <Text style={styles.detail}>{w.date || 'Fecha desconocida'} a las {w.time || 'Hora desconocida'}</Text>
                  <Text style={styles.detail}>Duración: {w.duration} min</Text>
                  <Text style={styles.detail}>Tipo: {w.walk_type}</Text>
                  <Text style={styles.status}>{w.status}</Text>

                  {w.is_rated ? (
                    <Text style={styles.rated}>Calificado</Text>
                  ) : w.status === "finalizado" ? (
                    <TouchableOpacity
                      onPress={() => {
                        set_selected_walk(w);
                        set_show_rating_modal(true);
                      }}
                    >
                      <Text style={styles.to_rate}>Por calificar</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>


              </View>
            </View>
          ))
        )}
      </ScrollView>

      <RatingModal
        visible={show_rating_modal}
        on_close={() => set_show_rating_modal(false)}
        on_submit={handle_submit_rating}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rated: {
    marginTop: 4,
    color: "#10B981",
    fontSize: 13,
    fontWeight: "600",
  },
  to_rate: {
    marginTop: 4,
    color: "#EAB308",
    fontSize: 13,
    fontWeight: "600",
  },

  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 30,
    gap: 12,
  },
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  back_btn: {
    padding: 4,
    marginRight: 8,
  },
  header_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginLeft: 8,
  },
  empty_text: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  pet_name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 13,
    color: "#007BFF",
    marginTop: 4,
  },
});