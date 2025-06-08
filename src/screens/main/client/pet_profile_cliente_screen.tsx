import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  Linking,
} from "react-native";
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import PetProfileComponent from "../../../components/shared/pet_profile_component";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";
import { get_pet_by_id } from "../../../service/pet_service";
import { get_active_walks_by_pet, get_walk_details } from "../../../service/walk_service";
import { get_contact_link_by_user_id } from "../../../service/contact_service";
import { use_auth } from "../../../hooks/use_auth";

type PetProfileRoute = RouteProp<RootStackParamList, "pet_profile_cliente_screen">;

interface pet_with_owner extends pet_model {
  owner: any;
}

export default function PetProfileClienteScreen() {
  const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<PetProfileRoute>();
  const { petId } = params;
  const is_focused = useIsFocused();
  const { user } = use_auth();
  const [walker, set_walker] = useState<{ user_id: number; name: string; phone: string; whatsapp_link: string } | null>(null);
  const [pet, set_pet] = useState<pet_with_owner | null>(null);
  const [loading, set_loading] = useState(true);
  const [active_tab, set_active_tab] = useState<"Acerca de" | "Salud" | "Contacto">("Acerca de");

  useEffect(() => {
    const fetch_data = async () => {
      set_loading(true);
      try {
        const [pet_data, walks] = await Promise.all([
          get_pet_by_id(petId),
          get_active_walks_by_pet(petId),
        ]);

        set_pet(pet_data);

        if (walks.length > 0) {
          const walk_id = walks[0].walk_id;
          const walk_details = await get_walk_details(walk_id);

          if (walk_details.walker?.user_id && walk_details.walker.user_id !== user?.user_id) {
            const contact = await get_contact_link_by_user_id(walk_details.walker.user_id);
            set_walker(contact);
          } else {
            set_walker(null);
          }

        } else {
          set_walker(null);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudo cargar el contacto del paseador.");
      } finally {
        set_loading(false);
      }
    };

    if (is_focused) {
      fetch_data();
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
    <PetProfileComponent
      pet={pet}
      active_tab={active_tab}
      on_tab_change={set_active_tab}
      api_base_url={process.env.EXPO_PUBLIC_API_URL || ""}
      on_edit_press={() => navigation.navigate("edit_pet_screen", { petId: pet.pet_id })}
      walker={walker || undefined}
      whatsapp_contact_link={active_tab === "Contacto" ? walker?.whatsapp_link : undefined}
      current_user_id={user?.user_id}
    />

  );
}
