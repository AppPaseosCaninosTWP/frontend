import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/stack_navigator";
import { get_user, get_token } from "../../utils/token_service";
import Header from "./header";

export default function SettingsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [notifications_enabled, set_notifications_enabled] = useState(false);
  const [is_private, set_is_private] = useState(false);
  const [user, set_user] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const token = await get_token();
      const user = await get_user();
      set_user(user);

      if (!user) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión de nuevo.");
        navigation.replace("Login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.id}/settings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (!json.error) {
          set_notifications_enabled(json.data.notifications);
          set_is_private(json.data.privacy);
        }
      } catch (e) {
        console.warn("No se pudieron cargar las preferencias", e);
      }
    })();
  }, []);

  const update_setting = async (field: string, value: boolean) => {
    const token = await get_token();
    const user = await get_user();

    if (!user) {
      Alert.alert("Sesión expirada", "Por favor inicia sesión de nuevo.");
      navigation.replace("Login");
      return;
    }

    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.id}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar la configuración");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Notificaciones */}
      <View style={styles.row}>
        <Feather name="bell" size={24} color="#333" />
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifications_enabled}
          onValueChange={(v) => {
            set_notifications_enabled(v);
            update_setting("notifications", v);
          }}
        />
      </View>

      {/* Privacidad */}
      <View style={styles.row}>
        <MaterialIcons name="lock-outline" size={24} color="#333" />
        <Text style={styles.label}>Privacidad</Text>
        <Switch
          value={is_private}
          onValueChange={(v) => {
            set_is_private(v);
            update_setting("privacy", v);
          }}
        />
      </View>

      {/* Preferencia de paseos */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => Alert.alert("En mantenimiento XD")}
      >
        <Ionicons name="settings-outline" size={24} color="#333" />
        <Text style={styles.label}>Preferencia de paseos</Text>
        <Feather name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      {/* Cambio de contraseña */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Feather name="key" size={24} color="#333" />
        <Text style={styles.label}>Cambio de contraseña</Text>
        <Feather name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>
      {/* Lenguaje */}
      <View style={styles.row}>
        <Feather name="globe" size={24} color="#333" />
        <Text style={styles.label}>Lenguaje</Text>
        <Text style={styles.value}>Español</Text>
      </View>
      {/* Cerrar sesión */}
      <TouchableOpacity
        style={styles.logout_button}
        onPress={() =>
          Alert.alert("Log out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Log out",
              style: "destructive",
              onPress: () => navigation.replace("Login"),
            },
          ])
        }
      >
        <Feather name="log-out" size={24} color="#E53935" />
        <Text style={styles.logout_text}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  logout_button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  logout_text: {
    marginLeft: 16,
    fontSize: 16,
    color: "#E53935",
  },
});
