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
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import type { pet_model } from "../../../models/pet_model";
import { get_pet_by_id, update_pet } from "../../../service/pet_service";
import { colors, spacing, font_sizes } from "../../../config/theme";

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
        const data = await get_pet_by_id(petId);
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
      await update_pet(petId, {
        name,
        breed,
        age: parseInt(age),
        zone,
        description,
        comments,
        medical_condition,
      });
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



export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: font_sizes.medium,
    fontWeight: "600",
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
    color: colors.text_primary,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    fontSize: font_sizes.medium,
    borderColor: "#d0d7de",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  picker_wrapper: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderColor: "#d0d7de",
    borderWidth: 1,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    paddingHorizontal: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  button_text: {
    color: colors.background,
    fontSize: font_sizes.large,
    fontWeight: "700",
  },
});
