import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { pet_model } from "../../models/pet_model";

interface Pet extends pet_model {
  owner: {
    user_id: number;
    name: string;
    email: string;
    phone: string;
  };
}

interface Props {
  pet: Pet;
  duration?: number;
  show_schedule_button?: boolean;
  show_cancel_button?: boolean;
  show_message_button?: boolean;
  whatsapp_contact_link?: string;
  current_user_id?: number;
  on_schedule_press?: () => void;
  on_cancel_press?: () => void;
  on_edit_press?: () => void;
  on_contact_press?: () => void;
  active_tab: "Acerca de" | "Salud" | "Contacto";
  on_tab_change: (tab: "Acerca de" | "Salud" | "Contacto") => void;
  api_base_url: string;
  walker?: {
    user_id: number;
    name: string;
    phone: string;
    whatsapp_link: string;
  };
}

const Pet_profile_component = ({
  pet,
  duration,
  show_schedule_button = false,
  show_cancel_button = false,
  show_message_button = false,
  whatsapp_contact_link,
  current_user_id,
  on_schedule_press,
  on_cancel_press,
  on_edit_press,
  on_contact_press,
  active_tab,
  on_tab_change,
  api_base_url,
  walker,
}: Props) => {
  const navigation = useNavigation();
  const tab_labels = ["Acerca de", "Salud", "Contacto"] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back_btn}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.header_center}>
          <Text style={styles.header_title}>Perfil de {pet.name}</Text>
        </View>
      </View>

      <View style={styles.tab_row}>
        {tab_labels.map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.tab_button,
              active_tab === label && styles.tab_button_active,
            ]}
            onPress={() => on_tab_change(label)}
          >
            <Text
              style={[
                styles.tab_text,
                active_tab === label && styles.tab_text_active,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll_content}>
        {active_tab === "Acerca de" && (
          <View style={styles.card}>
            <View style={styles.profile_header}>
              <Image
                source={
                  pet.photo
                    ? {
                      uri: `${api_base_url.replace(/\/$/, "")}/uploads/${pet.photo
                        }`,
                    }
                    : undefined
                }
                style={styles.pet_image}
                onError={() => console.warn("pet image error:", pet.photo)}
              />
              <View style={styles.name_row}>
                <Text style={styles.pet_name}>{pet.name}</Text>
                {on_edit_press && (
                  <TouchableOpacity
                    style={styles.edit_icon}
                    onPress={on_edit_press}
                  >
                    <Feather name="edit" size={18} color="#007BFF" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.pet_breed}>{pet.breed}</Text>
            </View>

            <Text style={styles.section_title}>
              Sobre la mascota
            </Text>
            <Text style={styles.paragraph}>{pet.description ?? "–"}</Text>

            <View style={styles.info_table}>
              <View style={styles.row}>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.value}>{pet.age} años</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sector</Text>
                <Text style={styles.value}>{pet.zone}</Text>
              </View>
              {duration && (
                <View style={styles.row}>
                  <Text style={styles.label}>Duración paseo</Text>
                  <Text style={styles.value}>{duration} min</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Comentarios</Text>
                <Text style={styles.value}>{pet.comments || "–"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dueño</Text>
                <Text style={styles.value}>{pet.owner.name}</Text>
              </View>
            </View>
          </View>
        )}

        {active_tab === "Salud" && (
          <View style={styles.card}>
            <View style={styles.section_header}>
              <Feather
                name="heart"
                size={20}
                color="#e74c3c"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.section_title}>Salud</Text>
            </View>
            <Text style={styles.section_title}>Condición médica</Text>
            <Text style={styles.paragraph}>
              {pet.medical_condition ?? "Sin datos de salud registrados."}
            </Text>
            <Text style={styles.section_title}>Comentarios</Text>
            <Text style={styles.paragraph}>
              {pet.comments ?? "Sin comentarios adicionales."}
            </Text>
          </View>
        )}

        {active_tab === "Contacto" && (
          <View style={styles.card}>
            <View style={styles.section_header}>
              <Feather
                name="phone"
                size={20}
                color="#27ae60"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.section_title}>Contacto</Text>
            </View>

            {/* Dueño */}
            <Text style={[styles.label, { marginBottom: 4 }]}>Dueño de la mascota</Text>
            <View style={styles.contact_card}>
              <Feather name="user" size={36} color="#666" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.contact_name}>{pet.owner.name}</Text>
                <Text style={styles.contact_info}>{pet.owner.phone}</Text>
                <Text style={styles.contact_info}>{pet.owner.email}</Text>
              </View>
            </View>

            {/* Paseador */}
            {walker && walker.user_id !== current_user_id && (
              <>
                <Text style={[styles.label, { marginTop: 20, marginBottom: 4 }]}>
                  Paseador asignado
                </Text>
                <View style={styles.contact_card}>
                  <Feather
                    name="user-check"
                    size={36}
                    color="#666"
                    style={{ marginRight: 12 }}
                  />
                  <View>
                    <Text style={styles.contact_name}>{walker.name}</Text>
                    <Text style={styles.contact_info}>{walker.phone}</Text>
                    <Text style={styles.contact_info}>
                      {walker.whatsapp_link.replace("https://wa.me/", "+")}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.message_button}
                  onPress={() => {
                    Linking.openURL(walker.whatsapp_link).catch(() => {
                      Alert.alert("Error", "No se pudo abrir WhatsApp");
                    });
                  }}
                >
                  <Text style={[styles.message_button_text, { marginLeft: 6 }]}>
                    Contactar a {walker.name} por WhatsApp
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        )}
      </ScrollView>

      {show_schedule_button && (
        <TouchableOpacity
          style={styles.schedule_button}
          onPress={on_schedule_press}
        >
          <Text style={styles.schedule_button_text}>Agendar paseo</Text>
        </TouchableOpacity>
      )}
      {show_cancel_button && (
        <TouchableOpacity
          style={styles.cancel_button}
          onPress={on_cancel_press}
        >
          <Text style={styles.cancel_button_text}>Cancelar paseo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  back_btn: {
    padding: 8,
    paddingVertical: 8,
    marginLeft: 16,
  },
  header_center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header_title: {
    marginRight: 50,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  tab_row: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab_button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tab_button_active: {
    backgroundColor: "#007BFF",
  },
  tab_text: {
    fontSize: 14,
    color: "#555",
  },
  tab_text_active: {
    color: "#fff",
    fontWeight: "600",
  },
  scroll_content: {
    padding: 16,
    paddingBottom: 32,
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  profile_header: {
    alignItems: "center",
    marginBottom: 12,
  },
  name_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  pet_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  pet_name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  pet_breed: {
    fontSize: 14,
    color: "#777",
  },
  section_title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginVertical: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  info_table: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
  },
  section_header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 8,
  },
  contact_card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  contact_name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  contact_info: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  message_button: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
  },
  message_button_text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  schedule_button: {
    backgroundColor: "#007BFF",
    paddingVertical: 24,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  schedule_button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancel_button: {
    backgroundColor: "#E74C3C",
    paddingVertical: 24,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  cancel_button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  edit_icon: {
    marginLeft: 8,
  },
});

export default Pet_profile_component;
