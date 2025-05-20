import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { get_token } from "../../../utils/token_service";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type PetProfileRouteProp = RouteProp<RootStackParamList, "PetProfileScreen">;
type PetProfileNavProp   = NativeStackNavigationProp<RootStackParamList, "PetProfileScreen">;

interface Pet {
  pet_id: number;
  name:   string;
  breed:  string;
  age:    number;
  zone:   string;
  description:       string | null;
  comments:          string | null;
  medical_condition: string | null;
  photo:             string;
  owner: {
    user_id: number;
    name:    string;
    email:   string;
    phone:   string;
  };
}

export default function PetProfileScreen() {
  const route      = useRoute<PetProfileRouteProp>();
  const navigation = useNavigation<PetProfileNavProp>();
  const { petId, duration } = route.params;
  const [showModal, setShowModal] = useState(false);
  const [pet, setPet]         = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Acerca de"|"Salud"|"Nutrición"|"Contacto">("Acerca de");

  useEffect(() => { fetchPet() }, []);

  const fetchPet = async () => {
    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/pet/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data, error, msg } = await res.json();
      if (error) throw new Error(msg);
      setPet(data);
    } catch (err: any) {
      Alert.alert("Error al cargar mascota", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
  if (!pet) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.errorText}>Mascota no encontrada.</Text>
    </View>
  );

  const TABS = ["Acerca de","Salud","Nutrición","Contacto"] as const;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil de {pet.name}</Text>
      </View>

      <View style={styles.tabRow}>
        {TABS.map(label => (
          <TouchableOpacity
            key={label}
            style={[
              styles.tabButton,
              activeTab === label && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab(label)}
          >
            <Text style={[
              styles.tabText,
              activeTab === label && styles.tabTextActive
            ]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "Acerca de" && (
          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: `${API_BASE_URL}/uploads/${pet.photo}` }}
                style={styles.petImage}
              />
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{`${pet.breed}`}</Text>
            </View>

            <Text style={styles.sectionTitle}>Apariencia y signos distintivos</Text>
            <Text style={styles.paragraph}>{pet.description ?? "–"}</Text>

            <View style={styles.infoTable}>
              <View style={styles.row}>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.value}>{pet.age} años</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sector</Text>
                <Text style={styles.value}>{pet.zone}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Duración paseo</Text>
                <Text style={styles.value}>{duration} min</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Comentarios</Text>
                <Text style={styles.value}>{pet.comments ?? "–"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dueño</Text>
                <Text style={styles.value}>{pet.owner.name}</Text>
              </View>
            </View>
          </View>
        )}

{activeTab === "Salud" && (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Feather name="heart" size={20} color="#e74c3c" style={{ marginRight: 10 }}  />
      <Text style={styles.sectionTitle}>Salud</Text>
    </View>
    <Text style={styles.paragraph}>
      {pet.medical_condition ?? "Sin datos de salud registrados."}
    </Text>
  </View>
)}


{activeTab === "Nutrición" && (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Feather name="coffee" size={20} color="#f39c12"style={{ marginRight: 10 }} />
      <Text style={styles.sectionTitle}>Nutrición</Text>
    </View>
    <Text style={styles.paragraph}>
      No hay datos de nutrición registrados.
    </Text>
  </View>
)}
{activeTab === "Contacto" && (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Feather name="phone" size={20} color="#27ae60" style={{ marginRight: 10 }} />
      <Text style={styles.sectionTitle}>Contacto</Text>
    </View>
    <View style={styles.contactCard}>
      <Feather name="user" size={36} color="#666" style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.contactName}>{pet.owner.name}</Text>
        <Text style={styles.contactInfo}>{pet.owner.phone}</Text>
        <Text style={styles.contactInfo}>{pet.owner.email}</Text>
      </View>
    </View>
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.primaryButton}>
        <Feather name="phone-call" size={16} color="#fff" />
        <Text style={styles.primaryButtonText}>Llamar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Feather name="mail" size={16} color="#27ae60" />
        <Text style={styles.secondaryButtonText}>Enviar mensaje</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.scheduleButton} onPress={() => setShowModal(true)}>
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar agendamiento</Text>
            <Text style={styles.modalMessage}>
              ¿Deseas agendar este paseo para {pet?.name}?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  //logica cuando se confirma el agendamiento (en mantencion)
                  setShowModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, styles.confirmText]}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#777",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },

  backButton: {
    marginRight: 16,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginRight: 45,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },

  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  tabButtonActive: {
    backgroundColor: "#007BFF",
  },

  tabText: {
    fontSize: 14,
    color: "#555",
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 12,
  },

  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },

  petName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  petBreed: {
    fontSize: 14,
    color: "#777",
  },

  sectionTitle: {
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

  infoTable: {
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 8,
  },

  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },

  contactIcon: {
    marginRight: 12,
  },

  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  contactInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#27ae60",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  secondaryButtonText: {
    color: "#27ae60",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  footer: {
    padding: 16,
    backgroundColor: "#F3F4F6",
  },

  scheduleButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 24,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  cancelText: {
    color: "#555",
  },
  confirmText: {
    color: "#fff",
  },
});
