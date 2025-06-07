//WALKER PROFILE SCREEN

//Importaciones y dependencias
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

//Servicios para obtener y actualizar el perfil del paseador
import {
  get_walker_profile,
  update_walker_profile,
} from "../../../service/walker_service";
import { get_token, get_user } from "../../../utils/token_service";
//Modelo
import type { walker_model } from "../../../models/walker_model";

//URL base de la API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditWalkerProfileScreen() {
  // Navegación
  const navigation = useNavigation();
  //Estado para la imagen del perfil
  const [image, set_image] = useState<string | null>(null);

  // Estados para los campos del formulario
  const [email, set_email] = useState("");
  const [phone, set_phone] = useState("");
  const [description, set_description] = useState("");
  const [name, set_name] = useState("");
  const [experience, set_experience] = useState("");
  const [walker_type, set_walker_type] = useState("");
  const [zone, set_zone] = useState("");

  //Control de edición
  const [is_editing, set_is_editing] = useState(false);
  const [user_id, set_user_id] = useState<number | null>(null);

  //Validación de campos
  const [email_error, set_email_error] = useState<string>("");
  const [phone_error, set_phone_error] = useState<string>("");
  const [has_errors, set_has_errors] = useState<boolean>(false);

  // Estados para manejar el perfil original y los cambios
  const [original_email, set_original_email] = useState("");
  const [original_phone, set_original_phone] = useState("");
  const [original_description, set_original_description] = useState("");
  //Datos completos del perfil del paseador traidos del backend
  const [profile, set_profile] = useState<walker_model | null>(null);

  //Validar formato de email
  const validate_email = (value: string) => {
    const email_regex = /^\S+@\S+\.\S+$/;
    if (!email_regex.test(value.trim())) {
      set_email_error("Ingresa un correo válido.");
      return false;
    }
    set_email_error("");
    return true;
  };

  //Validar formato de teléfono
  const validate_phone = (value: string) => {
    const only_digits = value.replace(/\D/g, "");
    if (only_digits.length !== 11) {
      set_phone_error("El teléfono debe incluir +56 y 9, más 8 dígitos.");
      return false;
    }
    set_phone_error("");
    return true;
  };

  // Efecto para verificar si hay errores en los campos
  // Deshabilita el botón de guardar si hay errores
  useEffect(() => {
    if (email_error || phone_error) {
      set_has_errors(true);
    } else {
      set_has_errors(false);
    }
  }, [email_error, phone_error]);

  //Funcion para cargar los datos del paseador
  const fetch_profile = async () => {
    try {
      //Obtiene token y usuario
      const token = await get_token();
      const user = await get_user();
      if (!token || !user?.id) throw new Error("Sesión no válida");
      set_user_id(user.id);

      //Llama al servicio para retornar walker_model
      const data = await get_walker_profile();
      set_profile(data);

      //Inicializamos los campos del formulario con los datos del paseador
      set_name(data.name);
      set_experience(String(data.experience));
      set_walker_type(data.walker_type);
      set_zone(data.zone);

      set_email(data.email);
      set_original_email(data.email);

      //Formateamos el teléfono
      let fmt_phone = data.phone;
      if (!fmt_phone.startsWith("+56 9")) {
        fmt_phone = `+56 9${fmt_phone.replace(/\D/g, "").slice(-8)}`;
      }
      set_phone(fmt_phone);
      set_original_phone(fmt_phone);

      set_description(data.description ?? "");
      set_original_description(data.description ?? "");

      //Cargamos foto si existe
      if (data.photo_url) {
        const remote_uri = data.photo_url.startsWith("http")
          ? data.photo_url
          : `${API_BASE_URL.replace(/\/$/, "")}/api/uploads/${data.photo_url}`;
        set_image(remote_uri);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  //Al montar la patalla se trae el perfil del paseador
  useEffect(() => {
    fetch_profile();
  }, []);

  //Manejadores de cambio de texto
  const handle_email_change = (text: string) => {
    set_email(text);
    validate_email(text);
  };

  const handle_phone_change = (text: string) => {
    set_phone(text);
    validate_phone(text);
  };

  //Seleccionar imagen desde la galería
  const pick_image = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesito acceso a tus fotos para cambiar la imagen."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      set_image(result.assets[0].uri);
    }
  };

  //Envia los datos al backend
  const handle_submit = async () => {
    //Validaciones previas
    if (email_error || phone_error) {
      Alert.alert("Error", "Corrige los campos marcados antes de continuar.");
      return;
    }
    if (!email.trim() || !phone.trim() || !description.trim()) {
      Alert.alert(
        "Campos requeridos",
        "Email, teléfono y descripción son obligatorios."
      );
      return;
    }
    if (!validate_email(email) || !validate_phone(phone)) {
      Alert.alert("Error", "Corrige el formato de correo o teléfono.");
      return;
    }

    try {
      const token = await get_token();
      if (!token || !user_id) throw new Error("Sesión no válida");

      //FormData para enviar los datos
      const form_data = new FormData();
      form_data.append("email", email.trim());
      form_data.append("phone", phone.replace(/\D/g, ""));
      form_data.append("description", description.trim());

      //Si se cambia la foto, se agrega al FormData
      if (image && profile && image !== profile.photo_url) {
        const uri_parts = image.split("/");
        const filename = uri_parts[uri_parts.length - 1];
        const match = /\.(\w+)$/.exec(filename);
        const mime_type = match ? `image/${match[1]}` : "image/jpeg";
        form_data.append("photo", {
          uri: image,
          name: filename,
          type: mime_type,
        } as any);
      }

      //Llama al servicio de actualizacion
      await update_walker_profile(form_data);

      Alert.alert("Éxito", "Tus datos están pendientes de aprobación.", [
        {
          text: "OK",
          onPress: () => {
            set_is_editing(false);
            fetch_profile();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error al actualizar", err.message);
    }
  };

  //Cancela la edicion
  const handle_cancel = () => {
    set_email(original_email);
    set_phone(original_phone);
    set_description(original_description);
    set_is_editing(false);
    set_email_error("");
    set_phone_error("");
    if (profile?.photo_url) {
      const remote_uri = profile.photo_url.startsWith("http")
        ? profile.photo_url
        : `${API_BASE_URL.replace(/\/$/, "")}/api/uploads/${profile.photo_url}`;
      set_image(remote_uri);
    } else {
      set_image(null);
    }
  };

  //Renderiza el formlario
  return (
    <ScrollView
      contentContainerStyle={styles.scroll_container}
      keyboardShouldPersistTaps="handled"
    >
      //header con boton de retroceso y titulo
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back_button}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil del paseador</Text>
      </View>
      //Selector de imagen
      <View style={styles.image_picker}>
        <TouchableOpacity
          onPress={is_editing ? pick_image : undefined}
          activeOpacity={0.7}
        >
          <Image
            source={
              image ? { uri: image } : require("../../../assets/user_icon.png")
            }
            style={styles.image}
          />
          {is_editing && (
            <View style={styles.edit_overlay}>
              <Feather name="camera" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      //Campo de solo lectura //Datos que no se pueden editar segun la ERS
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, styles.disabled_input]}
        value={name}
        editable={false}
      />
      <Text style={styles.label}>Años de experiencia</Text>
      <TextInput
        style={[styles.input, styles.disabled_input]}
        value={experience}
        editable={false}
      />
      <Text style={styles.label}>Tipo de paseador</Text>
      <TextInput
        style={[styles.input, styles.disabled_input]}
        value={walker_type}
        editable={false}
      />
      <Text style={styles.label}>Zona</Text>
      <TextInput
        style={[styles.input, styles.disabled_input]}
        value={zone}
        editable={false}
      />
      //Campos editables
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={[styles.input, !is_editing && styles.disabled_input]}
        value={email}
        onChangeText={handle_email_change}
        editable={is_editing}
        keyboardType="email-address"
      />
      {!!email_error && <Text style={styles.error_text}>{email_error}</Text>}
      <Text style={styles.label}>Teléfono móvil</Text>
      <TextInput
        style={[styles.input, !is_editing && styles.disabled_input]}
        value={phone}
        onChangeText={handle_phone_change}
        editable={is_editing}
        keyboardType="phone-pad"
      />
      {!!phone_error && <Text style={styles.error_text}>{phone_error}</Text>}
      <Text style={styles.label}>Descripción (máx 250 caracteres)</Text>
      <TextInput
        style={[
          styles.input,
          styles.text_area,
          !is_editing && styles.disabled_input,
        ]}
        value={description}
        onChangeText={set_description}
        editable={is_editing}
        multiline
        maxLength={250}
      />
      // Botones de acción
      {!is_editing ? (
        <TouchableOpacity
          style={styles.edit_button}
          onPress={() => set_is_editing(true)}
        >
          <Text style={styles.button_text}>Editar datos</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.save_button, has_errors && styles.button_disabled]}
            onPress={handle_submit}
            disabled={has_errors}
          >
            <Text style={styles.button_text}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel_button}
            onPress={handle_cancel}
          >
            <Text style={styles.button_text}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

//Estilos
const styles = StyleSheet.create({
  scroll_container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  back_button: {
    position: "absolute",
    left: 16,
    top: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  image_picker: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  edit_overlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },

  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
  },
  disabled_input: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  text_area: {
    height: 100,
    textAlignVertical: "top",
  },

  edit_button: {
    backgroundColor: "#0099ad",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  save_button: {
    backgroundColor: "#70c72a",
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
  },
  cancel_button: {
    backgroundColor: "#aaa",
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  button_disabled: {
    backgroundColor: "#ccc",
  },

  error_text: {
    color: "red",
    fontSize: 12,
    marginTop: 0,
    marginBottom: 8,
    marginHorizontal: 16,
  },
});
