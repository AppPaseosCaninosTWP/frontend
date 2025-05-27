import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const mockRatings = [
  {
    id: "1",
    name: "Walter White",
    rating: 5,
    date: "12.06.2025",
    time: "09:30",
    avatar: require("../../../assets/user_icon.png"),
  },
  {
    id: "2",
    name: "Shaggy Rogers",
    rating: 5,
    date: "12.06.2025",
    time: "09:30",
    avatar: require("../../../assets/user_icon.png"),
  },
  {
    id: "3",
    name: "Finn Mertens",
    rating: 5,
    date: "12.06.2025",
    time: "09:30",
    avatar: require("../../../assets/user_icon.png"),
  },
];

export default function RatingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calificaciones</Text>
      </View>

      <View style={styles.highlightCard}>
        <View>
          <Text style={styles.walkerName}>Carl "CJ" Johnson</Text>
          <Text style={styles.walkerLocation}>
            Grove Street Los Santos, EEUU
          </Text>
          <View style={styles.starsRow}>
            <Text style={styles.ratingNumber}>5,0</Text>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.reviews}>3 reviews</Text>
          </View>
        </View>
        <Image
          source={require("../../../assets/user_icon.png")}
          style={styles.avatarLarge}
        />
      </View>

      <Text style={styles.sectionTitle}>Calificadores</Text>

      <FlatList
        data={mockRatings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.ratingCard}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.ratingName}>{item.name}</Text>
              <Text style={styles.ratingDate}>
                {item.date} | {item.time}
              </Text>
              <Text style={styles.ratingStars}>★★★★★</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 40,
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
  highlightCard: {
    backgroundColor: "#007BFF",
    borderRadius: 12,
    padding: 30,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
  },
  walkerName: {
    fontSize: 25,
    fontWeight: "700",
    color: "#fff",
  },
  walkerLocation: {
    fontSize: 12,
    color: "#D0E7FF",
    marginTop: 4,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  ratingNumber: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  stars: {
    color: "#FFD700",
    fontSize: 16,
  },
  reviews: {
    fontSize: 12,
    color: "#E0F0FF",
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  ratingCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  ratingName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111",
  },
  ratingDate: {
    fontSize: 12,
    color: "#666",
  },
  ratingStars: {
    color: "#FFD700",
    fontSize: 16,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
