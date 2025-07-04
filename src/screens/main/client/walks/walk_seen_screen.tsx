import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { get_all_walks } from "../../../../service/walk_service";
import type { walk_model } from "../../../../models/walk_model";

export default function WalkSeenScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [walks, set_walks] = useState<walk_model[]>([]);
  const [loading, set_loading] = useState(true);

  const fetch_walks = async () => {
    try {
      const data = await get_all_walks();
      set_walks(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    fetch_walks();
    const interval = setInterval(fetch_walks, 15000);
    return () => clearInterval(interval);
  }, []);

  const get_bar_color = (status: string) => {
    switch (status.toLowerCase()) {
      case "en curso":
        return "#facc15";
      case "finalizado":
        return "#10b981";
      case "buscando paseador":
        return "#3b82f6";
      case "confirmado":
        return "#6366f1";
      default:
        return "#ccc";
    }
  };

  const render_card = (walk: walk_model) => (
    <View key={walk.walk_id} style={styles.card}>
      <Text style={styles.date}>
        {walk.date} | {walk.time}
      </Text>
      <Text style={styles.title}>Paseo - {walk.walk_type}</Text>
      <Text style={styles.status}>Estado: {walk.status?.toLowerCase()}</Text>
      <View
        style={[
          styles.progress_bar,
          { backgroundColor: get_bar_color(walk.status) },
        ]}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header_row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back_btn}
        >
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.header_title}>Historial</Text>
      </View>

      {walks.length === 0 ? (
        <Text style={styles.empty_text}>No hay paseos registrados.</Text>
      ) : (
        walks.map(render_card)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingTop: 30,
  },
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  back_btn: {
    paddingRight: 12,
  },
  header_title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  progress_bar: {
    height: 4,
    borderRadius: 6,
  },
  empty_text: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
});