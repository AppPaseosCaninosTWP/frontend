import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { get_token } from "../../../utils/token_service";
import PetProfileComponent from "../../../components/shared/pet_profile_component";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
type RouteParams = { petId: number; duration: number; walkId: number };
type PetProfileRoute = RouteProp<RootStackParamList, "PetProfileScreen">;
type Navigation = NativeStackNavigationProp<RootStackParamList, "PetProfileScreen">;

export default function PetProfileScreen() {
  const { params } = useRoute<PetProfileRoute>();
  const navigation = useNavigation<Navigation>();
  const { petId, duration, walkId } = params;
  const [pet, set_pet] = useState<pet_model & { owner: any } | null>(null);
  const [loading, set_loading] = useState(true);
  const [active_tab, set_active_tab] = useState<"Acerca de" | "Salud" | "Contacto">("Acerca de");
  const [scheduled_walk_id, set_scheduled_walk_id] = useState<number | null>(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const token = await get_token();

        const res_pet = await fetch(`${API_BASE_URL}/pet/get_pet_by_id/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: pet_data } = await res_pet.json();
        set_pet(pet_data);

        const res_walks = await fetch(`${API_BASE_URL}/walk/assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: walk_data } = await res_walks.json();
        const walk = walk_data.find((w: any) => w.pet_id === petId);
        if (walk) set_scheduled_walk_id(walk.walk_id);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };

    fetch_data();
  }, [petId]);

  const handle_schedule = async () => {
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walkId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.msg || "Error al agendar");
      Alert.alert("Éxito", "Paseo agendado", [{ text: "OK", onPress: () => navigation.navigate("DashboardPaseador") }]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handle_cancel = async () => {
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/walk/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walkId: scheduled_walk_id }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = res.status === 403
          ? "Solo puedes cancelar un paseo con 30 minutos de antelación"
          : json.msg || "Error al cancelar";
        throw new Error(msg);
      }
      Alert.alert("Cancelado", "Paseo cancelado", [{ text: "OK", onPress: () => navigation.navigate("DashboardPaseador") }]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Mascota no encontrada.</Text>
      </View>
    );
  }

  return (
    <PetProfileComponent
      pet={pet}
      duration={duration}
      active_tab={active_tab}
      on_tab_change={set_active_tab}
      show_schedule_button={!scheduled_walk_id}
      show_cancel_button={!!scheduled_walk_id}
      on_schedule_press={handle_schedule}
      on_cancel_press={handle_cancel}
      api_base_url={API_BASE_URL || ""}
    />
  );
}


