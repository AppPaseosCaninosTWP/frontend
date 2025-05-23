import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { get_token } from "../../../utils/token_service";
import PetProfileComponent from "../../../components/shared/pet_profile_component";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
type PetProfileRoute = RouteProp<RootStackParamList, "PetProfileClienteScreen">;

export default function PetProfileClienteScreen() {
  const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<PetProfileRoute>();
  const { petId } = params;
  const [pet, set_pet] = useState<pet_model & { owner: any } | null>(null);
  const [loading, set_loading] = useState(true);
  const [active_tab, set_active_tab] = useState<"Acerca de" | "Salud" | "Contacto">("Acerca de");

  useEffect(() => {
    const fetch_pet = async () => {
        console.log("petId recibido:", petId);
      if (!petId || isNaN(Number(petId))) {
        Alert.alert("Error", "ID de mascota inválido");
        set_loading(false);
        return;
      }

      try {
        const token = await get_token();
        const res = await fetch(`${API_BASE_URL}/pet/get_pet_by_id/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data } = await res.json();
        set_pet(data);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };

    fetch_pet();
  }, [petId]);

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
  <>
    <PetProfileComponent
    pet={pet}
    active_tab={active_tab}
    on_tab_change={set_active_tab}
    api_base_url={API_BASE_URL || ""}
    on_edit_press={() => navigation.navigate("EditPetScreen", { petId: pet.pet_id })}
    />

  </>
);

}



