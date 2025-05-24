import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { Feather } from "@expo/vector-icons";

export default function WalkConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Feather name="check-circle" size={64} color="#4BB543" style={styles.icon} />
      <Text style={styles.title}>¡Paseo solicitado con éxito!</Text>
      <Text style={styles.subtitle}>Tu solicitud ha sido enviada y pronto será tomada por un paseador.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DashboardCliente")}
      >
        <Text style={styles.button_text}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

