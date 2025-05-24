import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { get_token } from "../../../../utils/token_service";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_UPLOADS_URL = process.env.EXPO_PUBLIC_URL;

interface Walk {
  walk_id: number;
  pet_name: string;
  pet_photo: string;
  date: string;
  time: string;
  duration: number;
  status: string;
}

export default function WalkHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [walks, set_walks] = useState<Walk[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const fetch_walks = async () => {
      try {
        const token = await get_token();
        const res = await fetch(`${API_BASE_URL}/walk/get_all_walks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data, error } = await res.json();
        if (error) throw new Error("Error al obtener historial");
        set_walks(data);
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
      <Text style={styles.title}>Historial de Paseos</Text>
      {walks.length === 0 ? (
        <Text style={styles.empty_text}>Aún no tienes paseos registrados.</Text>
      ) : (
        walks.map((w) => (
          <View key={w.walk_id} style={styles.card}>
            <View style={styles.row}>
              <Image
                source={{ uri: `${API_UPLOADS_URL}/uploads/${w.pet_photo}` }}
                style={styles.avatar}
              />
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
