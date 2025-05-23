// Componente base pet_profile_component.tsx reutilizable para cliente y paseador con snake_case

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { pet_model } from "../../models/pet_model";
const API_UPLOADS_URL = process.env.EXPO_PUBLIC_URL;

interface Pet extends pet_model {
  owner: {
    user_id: number;
    name: string;
    email: string;
    phone: string;
  };
};

interface Props {
  pet: Pet;
  duration?: number;
  show_schedule_button?: boolean;
  show_cancel_button?: boolean;
  on_schedule_press?: () => void;
  on_cancel_press?: () => void;
  on_edit_press?: () => void;
  active_tab: "Acerca de" | "Salud" | "Contacto";
  on_tab_change: (tab: "Acerca de" | "Salud" | "Contacto") => void;
  api_base_url: string;
}

const Pet_profile_component = ({
  pet,
  duration,
  show_schedule_button = false,
  show_cancel_button = false,
  on_schedule_press,
  on_cancel_press,
  on_edit_press,
  active_tab,
  on_tab_change,
  api_base_url,
}: Props) => {
  const tab_labels = ["Acerca de", "Salud", "Contacto"] as const;

  return (
    <View style={styles.container}>
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
                source={{ uri: `${API_UPLOADS_URL}/uploads/${pet.photo}` }}
                style={styles.pet_image}
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

            <Text style={styles.section_title}>Apariencia y signos distintivos</Text>
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
              <Feather name="heart" size={20} color="#e74c3c" style={{ marginRight: 10 }} />
              <Text style={styles.section_title}>Salud</Text>
            </View>
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
              <Feather name="phone" size={20} color="#27ae60" style={{ marginRight: 10 }} />
              <Text style={styles.section_title}>Contacto</Text>
            </View>
            <View style={styles.contact_card}>
              <Feather name="user" size={36} color="#666" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.contact_name}>{pet.owner.name}</Text>
                <Text style={styles.contact_info}>{pet.owner.phone}</Text>
                <Text style={styles.contact_info}>{pet.owner.email}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {show_schedule_button && (
        <TouchableOpacity style={styles.schedule_button} onPress={on_schedule_press}>
          <Text style={styles.schedule_button_text}>Agendar paseo</Text>
        </TouchableOpacity>
      )}

      {show_cancel_button && (
        <TouchableOpacity style={styles.cancel_button} onPress={on_cancel_press}>
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
  label: {
    fontSize: 14,
    color: "#555",
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


