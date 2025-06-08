import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { get_user_pets } from "../../../../service/pet_service";
import type { pet_model } from "../../../../models/pet_model";
import LocationPicker from "../../../../components/walks/location_picker";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import { Feather } from "@expo/vector-icons";
import { create_walk } from '../../../../service/walk_service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type WalkRouteProp = RouteProp<RootStackParamList, "create_walk_screen">;

export default function CreateWalkScreen() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<WalkRouteProp>();
  const walk_type = params?.type || "esporadico";

  const [pets, set_pets] = useState<pet_model[]>([]);
  const [selected_pet_id, set_selected_pet_id] = useState<number | null>(null);
  const [date, set_date] = useState(new Date());
  const [duration, set_duration] = useState("30");
  const [comments, set_comments] = useState("");
  const [days, set_days] = useState<string[]>([]);
  const [show_date_picker, set_show_date_picker] = useState(false);
  const [show_time_picker, set_show_time_picker] = useState(false);
  const [show_location_picker, set_show_location_picker] = useState(false);
  const [selected_location, set_selected_location] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const fetch_pets = async () => {
      try {
        const result = await get_user_pets();
        const pets_with_id: pet_model[] = result.map((pet: any) => ({
          ...pet,
          pet_id: pet.pet_id ?? pet.id,
        }));
        set_pets(pets_with_id);
        if (pets_with_id.length > 0) set_selected_pet_id(pets_with_id[0].pet_id);
      } catch (err) {
        Alert.alert("Error", "No se pudieron cargar las mascotas.");
      }
    };
    fetch_pets();
  }, []);

  useEffect(() => {
    if (walk_type === "esporadico") {
      const weekdays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
      const selected_day = weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
      set_days([selected_day]);
    }
  }, [date]);

  const toggle_day = (day: string) => {
    if (walk_type === "esporadico") return;
    set_days((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handle_submit = async () => {
    if (!selected_pet_id || !duration || !selected_location || days.length === 0) {
      Alert.alert("Faltan campos", "Completa todos los campos, elige días y confirma ubicación");
      return;
    }

    if (date.getTime() < new Date().setHours(0, 0, 0, 0)) {
      Alert.alert("Fecha inválida", "No puedes seleccionar una fecha pasada");
      return;
    }

    const walk_type_id = walk_type === "fijo" ? 1 : 2;

    if (walk_type_id === 1 && days.length < 2) {
      Alert.alert("Error", "Un paseo fijo requiere al menos 2 días");
      return;
    }

    if (walk_type_id === 2 && days.length !== 1) {
      Alert.alert("Error", "Un paseo esporádico debe tener exactamente 1 día");
      return;
    }

    try {
      await create_walk({
        walk_type_id,
        pet_ids: [selected_pet_id],
        comments,
        start_time: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
        duration: parseInt(duration),
        days,
      });

      navigation.navigate("walk_confirmation_screen");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const weekdays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  if (show_location_picker) {
    return (
      <LocationPicker
        on_confirm={(location: { latitude: number; longitude: number }) => {
          set_selected_location(location);
          set_show_location_picker(false);
        }}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header_row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Solicitar Paseo {walk_type === 'fijo' ? 'Fijo' : 'Esporádico'}</Text>
      </View>

      <Text style={styles.label}>Mascota</Text>
      <View style={styles.picker_wrapper}>
        <Picker
          selectedValue={selected_pet_id}
          onValueChange={(val) => set_selected_pet_id(val)}
        >
          {pets.map((pet) => (
            <Picker.Item key={pet.pet_id} label={pet.name} value={pet.pet_id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Fecha del paseo</Text>
      <Text style={styles.info_text}>
        {walk_type === "fijo"
          ? "Esta será la fecha de inicio del plan de paseos."
          : "Selecciona la fecha específica del paseo."}
      </Text>

      <TouchableOpacity onPress={() => set_show_date_picker(true)} style={styles.input}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {show_date_picker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            set_show_date_picker(false);
            if (selectedDate) {
              const newDate = new Date(date);
              newDate.setFullYear(selectedDate.getFullYear());
              newDate.setMonth(selectedDate.getMonth());
              newDate.setDate(selectedDate.getDate());
              set_date(newDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Hora del paseo</Text>
      <Text style={styles.info_text}>
        {walk_type === "fijo"
          ? "Esta será la hora de inicio para todos los días seleccionados."
          : "Hora única en que se realizará el paseo."}
      </Text>
      <TouchableOpacity onPress={() => set_show_time_picker(true)} style={styles.input}>
        <Text>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {show_time_picker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            set_show_time_picker(false);
            if (selectedTime) {
              const newDate = new Date(date);
              newDate.setHours(selectedTime.getHours());
              newDate.setMinutes(selectedTime.getMinutes());
              set_date(newDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Duración del paseo</Text>
      <Text style={styles.info_text}>Duración estándar: 30 o 60 minutos.</Text>
      <View style={styles.picker_wrapper}>
        <Picker
          selectedValue={duration}
          onValueChange={(val) => set_duration(val)}
        >
          <Picker.Item label="30 minutos" value="30" />
          <Picker.Item label="1 hora" value="60" />
        </Picker>
      </View>

      <Text style={styles.label}>Comentarios adicionales</Text>
      <TextInput
        value={comments}
        onChangeText={set_comments}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <Text style={styles.label}>Días del paseo</Text>
      {walk_type === "fijo" && (
        <Text style={styles.info_text}>Selecciona al menos 2 días en los que deseas que se realice el paseo.</Text>
      )}
      {walk_type === "esporadico" && (
        <Text style={styles.info_text}>El día se selecciona automáticamente según la fecha elegida.</Text>
      )}

      <View style={styles.day_grid}>
        {weekdays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.day_button, days.includes(day) && styles.day_button_active]}
            onPress={() => toggle_day(day)}
            disabled={walk_type === "esporadico"}
          >
            <Text style={[styles.day_text, days.includes(day) && styles.day_text_active]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={() => set_show_location_picker(true)}
      >
        <Text style={styles.button_text}>
          {selected_location ? "Cambiar ubicación" : "Confirmar ubicación en mapa"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handle_submit} style={styles.button}>
        <Text style={styles.button_text}>Solicitar Paseo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingTop: 40,
  },
  header_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  back_btn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  info_text: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F9FAFB",
  },
  picker_wrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
  },
  day_grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  day_button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  day_button_active: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  day_text: {
    color: "#333",
    fontSize: 14,
  },
  day_text_active: {
    color: "#fff",
    fontWeight: "600",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
