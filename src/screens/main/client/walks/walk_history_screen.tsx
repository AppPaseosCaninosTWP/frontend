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

const API_UPLOADS_URL = process.env.EXPO_PUBLIC_URL;

export default function WalkHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [walks, set_walks] = useState<walk_model[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const fetch_walks = async () => {
      try {
        const data = await get_all_walks();

        const mapped = data.map((walk: { days: any[]; pets: any[] }) => {
          const first_day = walk.days?.[0];
          const first_pet = walk.pets?.[0];

          return {
            ...walk,
            date: first_day?.start_date || '',
            time: first_day?.start_time || '',
            duration: first_day?.duration || 0,
            pet_name: first_pet?.name || '',
            pet_photo: first_pet?.photo || '',
          };
        });

        set_walks(mapped);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };
    fetch_walks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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
                <Text style={styles.detail}>{w.date} a las {w.time}</Text>
                <Text style={styles.detail}>Duración: {w.duration} min</Text>
                <Text style={styles.status}>{w.status}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 40,
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
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
