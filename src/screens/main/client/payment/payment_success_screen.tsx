import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { Feather } from "@expo/vector-icons";

export default function PaymentSuccessScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "DashboardCliente" }],
      });
    });
  }, []);

  const progress_width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.back_button}
      >
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Image
        source={require("../../../../assets/empty_state.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>¡Pago realizado!</Text>
      <Text style={styles.subtitle}>
        Tu pago fue procesado con éxito. Redirigiendo al inicio...
      </Text>

      <View style={styles.progress_bar_container}>
        <Animated.View style={[styles.progress_bar_fill, { width: progress_width }]} />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("DashboardCliente")}
        style={styles.button}
      >
        <Text style={styles.button_text}>Ir ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  back_button: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  progress_bar_container: {
    width: "80%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  progress_bar_fill: {
    height: "100%",
    backgroundColor: "#007BFF",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
