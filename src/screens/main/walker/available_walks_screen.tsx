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
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { walk_model } from "../../../models/walk_model";
import { get_available_walks } from "../../../service/walk_service";

export default function AvailableWalksScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [all_walks, set_all_walks] = useState<walk_model[]>([]);
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
      const data = await get_available_walks();
      set_all_walks(data);
    } catch (err: any) {
      Alert.alert("Error al cargar paseos", err.message);
    } finally {
      set_loading(false);
    }
  };

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\u0300-\u036f/g, "")
      .toLowerCase();

  const walks_to_show = all_walks.filter(
    (w) =>
      w.status === "pendiente" &&
      normalize(w.walk_type) === normalize(selected_tab)
  );

  const render_item = ({ item }: { item: walk_model }) => {
    const { pet_name, photo_url, date, time, sector } = item;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate("PetProfileScreen", {
            walkId: item.walk_id,
            petId: item.pet_id!,
            duration: item.duration ?? 0,
          });
        }}
      >
        <View style={styles.cardHeader}>
          {photo_url ? (
            <Image
              source={{ uri: photo_url }}
              style={styles.avatar}
              onError={() => console.warn("Error cargando imagen:", photo_url)}
            />
          ) : (
            <Feather name="user" size={48} color="#ccc" style={styles.avatar} />
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{pet_name}</Text>
            <Text style={styles.meta}>
              {`Paseo ${selected_tab}  |  ${time}  |  ${date}`}
            </Text>
            <Text style={styles.meta}>{`Antofagasta ${sector}`}</Text>
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
        <Text style={styles.headerTitle}>Paseos disponibles</Text>
      </View>

      <View style={styles.tabContainer}>
        {["Fijo", "Esporádico"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selected_tab === tab && styles.tabButtonActive,
            ]}
            onPress={() => set_selected_tab(tab as "Fijo" | "Esporádico")}
          >
            <Text
              style={[
                styles.tabText,
                selected_tab === tab && styles.tabTextActive,
              ]}
            >
              Paseos {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={walks_to_show}
          keyExtractor={(w) => w.walk_id.toString()}
          renderItem={render_item}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
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
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 0.9,
    color: "#111",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tabText: { fontSize: 14, color: "#555" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  emptyText: {
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
  cardHeader: {
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
});
