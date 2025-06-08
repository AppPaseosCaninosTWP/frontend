import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import PetProfileComponent from "../../../components/shared/pet_profile_component";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";
import { get_pet_by_id } from "../../../service/pet_service";

type PetProfileRoute = RouteProp<RootStackParamList, "pet_profile_cliente_screen">;

interface pet_with_owner extends pet_model {
  owner: any;
}

export default function PetProfileClienteScreen() {
  const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<PetProfileRoute>();
  const { petId } = params;
  const is_focused = useIsFocused();
  const [pet, set_pet] = useState<pet_with_owner | null>(null);
  const [loading, set_loading] = useState(true);
  const [active_tab, set_active_tab] = useState<"Acerca de" | "Salud" | "Contacto">("Acerca de");

  useEffect(() => {
    const fetch_pet = async () => {
      if (!petId || isNaN(Number(petId))) {
        Alert.alert("Error", "ID de mascota inválido");
        set_loading(false);
        return;
      }

      try {
        const pet_data = await get_pet_by_id(petId);
        set_pet(pet_data as pet_with_owner);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };

    if (is_focused) {
      fetch_pet();
    }
  }, [petId, is_focused]);

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
        api_base_url={process.env.EXPO_PUBLIC_API_URL || ""}
        on_edit_press={() => navigation.navigate("edit_pet_screen", { petId: pet.pet_id })}
      />
    </>
  );
}
