import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from "@react-navigation/native";
import { get_token } from "../../../utils/token_service";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
type PetEditRoute = RouteProp<RootStackParamList, "EditPetScreen">;

export default function EditPetScreen() {
  const { params } = useRoute<PetEditRoute>();
  const navigation = useNavigation();
  const { petId } = params;

  const [pet, set_pet] = useState<pet_model | null>(null);
  const [loading, set_loading] = useState(true);

  const [name, set_name] = useState("");
  const [breed, set_breed] = useState("");
  const [age, set_age] = useState("0");
  const [zone, set_zone] = useState<"norte" | "centro" | "sur">("norte");
  const [description, set_description] = useState("");
  const [comments, set_comments] = useState("");
  const [medical_condition, set_medical_condition] = useState("");

  useEffect(() => {
    const fetch_pet = async () => {
      try {
        const token = await get_token();
        const res = await fetch(`${API_BASE_URL}/pet/get_pet_by_id/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data } = await res.json();
        set_pet(data);
        set_name(data.name);
        set_breed(data.breed || "");
        set_age(data.age.toString());
        set_zone(data.zone);
        set_description(data.description);
        set_comments(data.comments || "");
        set_medical_condition(data.medical_condition);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    };

    fetch_pet();
  }, [petId]);

  const handle_save = async () => {
    if (isNaN(parseInt(age)) || parseInt(age) < 0) {
      Alert.alert("Edad inválida", "Por favor ingresa una edad válida.");
      return;
    }

    try {
      const token = await get_token();
      const res = await fetch(`${API_BASE_URL}/pet/update_pet/${petId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          breed,
          age: parseInt(age),
          zone,
          description,
          comments,
          medical_condition,
        }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar la mascota");
      Alert.alert("Éxito", "Mascota actualizada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading || !pet) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando mascota...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput value={name} onChangeText={set_name} style={styles.input} />

        <Text style={styles.label}>Raza</Text>
        <TextInput value={breed} onChangeText={set_breed} style={styles.input} />

        <Text style={styles.label}>Edad</Text>
        <TextInput value={age} onChangeText={set_age} keyboardType="numeric" style={styles.input} />

        <Text style={styles.label}>Zona</Text>
        <View style={styles.picker_wrapper}>
          <Picker
            selectedValue={zone}
            onValueChange={(itemValue) => set_zone(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Norte" value="norte" />
            <Picker.Item label="Centro" value="centro" />
            <Picker.Item label="Sur" value="sur" />
          </Picker>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={set_description}
          multiline
          style={styles.input}
        />

        <Text style={styles.label}>Comentarios</Text>
        <TextInput
          value={comments}
          onChangeText={set_comments}
          multiline
          style={styles.input}
        />

        <Text style={styles.label}>Condición médica</Text>
        <TextInput
          value={medical_condition}
          onChangeText={set_medical_condition}
          multiline
          style={styles.input}
        />

        <TouchableOpacity onPress={handle_save} style={styles.button}>
          <Text style={styles.button_text}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 40,
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  picker_wrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
