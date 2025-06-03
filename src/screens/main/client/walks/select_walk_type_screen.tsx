import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SelectWalkTypeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.header_center}>
          <Text style={styles.header_title}>¿Qué tipo de paseo deseas solicitar?</Text>
        </View>
      </View>

      <View style={styles.option_list}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CreateWalkScreen", { type: "esporadico" })}
        >
          <Feather name="clock" size={32} color="#007AFF" style={styles.card_icon} />
          <Text style={styles.card_title}>Paseo Esporádico</Text>
          <Text style={styles.card_text}>Un paseo único, para cuando lo necesitas.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CreateWalkScreen", { type: "fijo" })}
        >
          <MaterialCommunityIcons name="calendar-check-outline" size={32} color="#007AFF" style={styles.card_icon} />
          <Text style={styles.card_title}>Paseo Fijo</Text>
          <Text style={styles.card_text}>Configura días y horarios recurrentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.disabled_card]} disabled>
          <MaterialCommunityIcons name="account-question-outline" size={32} color="#007AFF" style={styles.card_icon} />
          <Text style={styles.card_title}>Paseo de Prueba</Text>
          <Text style={styles.card_text}>Evalúa compatibilidad con tu paseador.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  back_btn: {
    padding: 8,
    marginLeft: -8,
  },
  header_center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24, // Para compensar el ícono de la izquierda
  },
  header_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  option_list: {
    gap: 16,
  },
  card: {
    backgroundColor: "#E6F0FF",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  disabled_card: {
    opacity: 0.5,
  },
  card_icon: {
    marginBottom: 10,
  },
  card_title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#007AFF",
    textAlign: "center",
  },
  card_text: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

