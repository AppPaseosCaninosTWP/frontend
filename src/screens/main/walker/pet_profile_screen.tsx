import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { get_token } from "../../../utils/token_service";
import PetProfileComponent from "../../../components/shared/pet_profile_component";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
type PetProfileRoute = RouteProp<RootStackParamList, "PetProfileScreen">;
type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  "PetProfileScreen"
>;

export default function PetProfileScreen() {
  const { params } = useRoute<PetProfileRoute>();
  const navigation = useNavigation<Navigation>();
  const { petId, duration, walkId } = params;

  const [pet, set_pet] = useState<(pet_model & { owner: any }) | null>(null);
  const [loading, set_loading] = useState(true);
  const [active_tab, set_active_tab] = useState<
    "Acerca de" | "Salud" | "Contacto"
  >("Acerca de");
  const [scheduled_walk_id, set_scheduled_walk_id] = useState<number | null>(
    null
  );
  const [confirming, set_confirming] = useState<"schedule" | "cancel" | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const token = await get_token();

        const res_pet = await fetch(`${API_BASE_URL}/pet/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res_pet.ok) {
          throw new Error("Mascota no encontrada");
        }
        const { data: pet_data } = await res_pet.json();
        set_pet(pet_data);

        const res_walks = await fetch(`${API_BASE_URL}/walk/assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: walk_data } = await res_walks.json();
        const w = walk_data.find((w: any) => w.pet_id === petId);
        if (w) set_scheduled_walk_id(w.walk_id);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    })();
  }, [petId]);

  const handle_schedule = async () => {
    set_confirming(null);
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk/${walkId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_status: "confirmado" }),
      });
      const json = await res.json();
      if (!res.ok || json.error)
        throw new Error(json.msg || "Error al agendar paseo");
      Alert.alert("¡Listo!", "Paseo agendado", [
        {
          text: "OK",
          onPress: () => navigation.navigate("DashboardPaseador"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handle_cancel = async () => {
    set_confirming(null);
    if (scheduled_walk_id === null) {
      Alert.alert("Error", "No hay paseo asignado que cancelar.");
      return;
    }
    try {
      const token = await get_token();
      const res = await fetch(
        `${API_BASE_URL}/walk/${scheduled_walk_id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_status: "cancelado" }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        const msg =
          res.status === 403
            ? "Solo puedes cancelar un paseo con 30 minutos de antelación"
            : json.msg || "Error al cancelar paseo";
        throw new Error(msg);
      }
      Alert.alert("Cancelado", "Paseo cancelado", [
        {
          text: "OK",
          onPress: () => navigation.navigate("DashboardPaseador"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!pet) {
    return (
      <View style={styles.center}>
        <Text>Mascota no encontrada.</Text>
      </View>
    );
  }

  return (
    <>
      <PetProfileComponent
        pet={pet}
        duration={duration}
        active_tab={active_tab}
        on_tab_change={set_active_tab}
        show_schedule_button={!scheduled_walk_id}
        show_cancel_button={!!scheduled_walk_id}
        on_schedule_press={() => set_confirming("schedule")}
        on_cancel_press={() => set_confirming("cancel")}
        api_base_url={API_BASE_URL || ""}
      />

      <Modal
        transparent
        visible={confirming !== null}
        animationType="fade"
        onRequestClose={() => set_confirming(null)}
      >
        <View style={styles.modal_overlay}>
          <View style={styles.modal_box}>
            <Text style={styles.modal_title}>
              {confirming === "schedule"
                ? `¿Agendar paseo para ${pet.name}?`
                : `¿Cancelar paseo de ${pet.name}?`}
            </Text>
            <View style={styles.modal_buttons}>
              <TouchableOpacity
                style={[styles.modal_btn_half, styles.cancel_btn]}
                onPress={() => set_confirming(null)}
              >
                <Text style={styles.cancel_text}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modal_btn_half,
                  confirming === "cancel" ? styles.red_btn : styles.confirm_btn,
                ]}
                onPress={
                  confirming === "schedule" ? handle_schedule : handle_cancel
                }
              >
                <Text
                  style={
                    confirming === "cancel"
                      ? styles.confirm_text_on_red
                      : styles.confirm_text
                  }
                >
                  {confirming === "schedule" ? "Sí, agendar" : "Sí, cancelar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get("window");
const BOX_WIDTH = width * 0.8;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal_box: {
    width: BOX_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modal_title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modal_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modal_btn_half: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancel_btn: {
    backgroundColor: "#eee",
  },
  confirm_btn: {
    backgroundColor: "#4caf50",
  },
  red_btn: {
    backgroundColor: "#f44336",
  },
  cancel_text: {
    color: "#333",
    fontWeight: "500",
  },
  confirm_text: {
    color: "#fff",
    fontWeight: "600",
  },
  confirm_text_on_red: {
    color: "#fff",
    fontWeight: "600",
  },
});
