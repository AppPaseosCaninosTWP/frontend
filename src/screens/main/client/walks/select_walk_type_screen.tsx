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

export default function SelectWalkTypeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header_row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header_title}>¿Qué tipo de paseo deseas solicitar?</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CreateWalkScreen", { type: "esporadico" })}
        >
          <Text style={styles.card_title}>Paseo Esporádico</Text>
          <Text style={styles.card_text}>Un paseo único, para cuando lo necesitas.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CreateWalkScreen", { type: "fijo" })}
        >
          <Text style={styles.card_title}>Paseo Fijo</Text>
          <Text style={styles.card_text}>Configura días y horarios recurrentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.disabled_card]}
          disabled={true}
        >
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
    padding: 20,
    paddingTop: 40,
  },
  header_container: {
    marginBottom: 20,
    alignItems: "center",
  },
  back_btn: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabled_card: {
    opacity: 0.5,
  },
  card_title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
    textAlign: "center",
  },
  card_text: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  header_row: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
},
header_title: {
  fontSize: 18,
  fontWeight: "700",
  textAlign: "center",
  flex: 1,
},

});



