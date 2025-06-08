//PET PROFILE SCREEN

//Importaciones y dependencias
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
  Linking, //Whatsapp
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

//Componente
import PetProfileComponent from "../../../components/shared/pet_profile_component";
//Modelo
import type { pet_model } from "../../../models/pet_model";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
//Servicios
import {
  get_pet_by_id,
  get_assigned_walk_for_pet,
  update_walk_status,
} from "../../../service/pet_service";

//Obtener el ancho de la pantalla para calcular el ancho del modal
const { width } = Dimensions.get("window");
const BOX_WIDTH = width * 0.8;

//Definición de tipos para la ruta y navegación
type PetProfileRoute = RouteProp<RootStackParamList, "pet_profile_screen">;
type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  "pet_profile_screen"
>;

export default function PetProfileScreen() {
  //Obtener parámetros (petId, duration, walkId) de la ruta
  const { params } = useRoute<PetProfileRoute>();
  const navigation = useNavigation<Navigation>();
  const { petId, duration, walkId } = params;

  //Estados para manejar los datos de la mascota, carga, pestaña activa, ID del paseo agendado y confirmación
  const [pet_data, set_pet_data] = useState<
    (pet_model & { owner: any }) | null
  >(null);
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

  //Efecto al montar o cambiar el petId
  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        //Obtiene datos de la mascota por su ID
        const pet_info = await get_pet_by_id(petId);
        set_pet_data(pet_info);

        //Verifica si hay un paseo asignado para esta mascota
        const assigned_walk = await get_assigned_walk_for_pet(petId);
        if (assigned_walk) {
          set_scheduled_walk_id(assigned_walk.walk_id);
        }
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    })();
  }, [petId]);

  //Funcion para enviar mensaje por WhatsApp
  const handle_contact = () => {
    if (!pet_data?.owner?.phone) {
      Alert.alert("Error", "Número de teléfono no disponible");
      return;
    }

    //Elimina caracteres no numéricos del número de teléfono
    const phone_number = pet_data.owner.phone.replace(/[^0-9+]/g, "");
    const url_app = `whatsapp://send?phone=${phone_number}`;
    const url_web = `https://api.whatsapp.com/send?phone=${phone_number}`;

    //Intenta abrir WhatsApp, si no está instalado, abre WhatsApp Web
    Linking.canOpenURL(url_app)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url_app);
        } else {
          return Linking.openURL(url_web);
        }
      })
      .catch((err) => {
        console.error("Error al abrir WhatsApp:", err);
        //Si hay error, intenta abrir WhatsApp Web
        Linking.openURL(url_web).catch(() => {
          Alert.alert("Error", "No se pudo abrir WhatsApp ni WhatsApp Web");
        });
      });
  };

  //Funcion para agendar y cancelar paseo
  const handle_schedule = async () => {
    set_confirming(null);
    if (!walkId) return;
    try {
      await update_walk_status(walkId, "confirmado");
      Alert.alert("¡Listo!", "Paseo agendado", [
        { text: "OK", onPress: () => navigation.navigate("dashboard_paseador") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handle_cancel = async () => {
    set_confirming(null);
    if (!scheduled_walk_id) return;
    try {
      await update_walk_status(scheduled_walk_id, "cancelado");
      Alert.alert("Cancelado", "Paseo cancelado", [
        { text: "OK", onPress: () => navigation.navigate("dashboard_paseador") },
      ]);
    } catch (err: any) {
      const msg = err.message.includes("403")
        ? "Solo puedes cancelar un paseo con 30 minutos de antelación"
        : err.message;
      Alert.alert("Error", msg);
    }
  };

  //Si está cargando, muestra un indicador de carga
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  //Renderizado si no hay datos de mascota
  if (!pet_data) {
    return (
      <View style={styles.center}>
        <Text>Mascota no encontrada.</Text>
      </View>
    );
  }

  //Renderizado final de pantalla
  return (
    <>
      {/*Componente generico que muestra datos de la mascota*/}
      <PetProfileComponent
        pet={pet_data}
        duration={duration}
        active_tab={active_tab}
        on_tab_change={set_active_tab}
        show_schedule_button={!scheduled_walk_id}
        show_cancel_button={!!scheduled_walk_id}
        show_message_button={true}
        on_schedule_press={() => set_confirming("schedule")}
        on_cancel_press={() => set_confirming("cancel")}
        on_contact_press={handle_contact}
        api_base_url={process.env.EXPO_PUBLIC_API_URL || ""}
      />

      {/*Modal de confirmacion para agendar o cancelar paseo*/}
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
                ? `¿Agendar paseo para ${pet_data.name}?`
                : `¿Cancelar paseo de ${pet_data.name}?`}
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

//Estilos para la pantalla
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
