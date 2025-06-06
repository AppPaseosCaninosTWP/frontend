// src/screens/main/Admin/registerWalker_screen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import HeaderAdmin from '../../../components/shared/header_admin';
import { register_Walker } from '../../../service/walker_service';

export default function RegisterWalkerScreen() {
  // ─── States para cada campo ─────────────────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [walkerType, setWalkerType] = useState<'Fijo' | 'Esporádico' | ''>('');
  const [zone, setZone] = useState<'Norte' | 'Centro' | 'Sur' | ''>('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ─── Estado para almacenar errores de validación ───────────────────────────────────────────────────
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    experience?: string;
    walkerType?: string;
    zone?: string;
    description?: string;
    photoUri?: string;
  }>({});

  // ─── Función para validar todos los campos antes de enviar ───────────────────────────────────────────
  const validateAllFields = () => {
    const newErrors: typeof errors = {};

    // Nombre obligatorio
    if (!name.trim()) {
      newErrors.name = 'Campo obligatorio';
    }

    // Email mínimo: no vacío (podrías extender validación de formato si lo deseas)
    if (!email.trim()) {
      newErrors.email = 'Campo obligatorio';
    }

    // Teléfono: 9 dígitos, debe empezar con '9'
    if (!phone.trim()) {
      newErrors.phone = 'Campo obligatorio';
    } else {
      const normalized = phone.replace(/\s+/g, ''); // quitar espacios
      if (!/^[9][0-9]{8}$/.test(normalized)) {
        newErrors.phone = 'Debe ser 9 dígitos y empezar con 9';
      }
    }

    // Contraseña: obligatorio + longitud entre 8 y 15
    if (!password) {
      newErrors.password = 'Campo obligatorio';
    } else if (password.length < 8 || password.length > 15) {
      newErrors.password = 'Debe tener entre 8 y 15 caracteres';
    }

    // Confirmar contraseña: obligatorio + debe coincidir
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Campo obligatorio';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'No coincide con la contraseña';
    }

    // Experiencia: obligatorio + número >= 0
    if (!experience.trim()) {
      newErrors.experience = 'Campo obligatorio';
    } else if (isNaN(Number(experience)) || Number(experience) < 0) {
      newErrors.experience = 'Debe ser un número válido';
    }

    // Tipo de paseador: obligatorio
    if (!walkerType) {
      newErrors.walkerType = 'Campo obligatorio';
    }

    // Zona: obligatorio
    if (!zone) {
      newErrors.zone = 'Campo obligatorio';
    }

    // Descripción: obligatorio
    if (!description.trim()) {
      newErrors.description = 'Campo obligatorio';
    }

    // Foto: obligatorio
    if (!photoUri) {
      newErrors.photoUri = 'Debe seleccionar una foto';
    }

    setErrors(newErrors);
    // Si no hay errores, newErrors estará vacío
    return Object.keys(newErrors).length === 0;
  };

  // ─── Función para validar un campo en particular al perder el foco ──────────────────────────────────
  const validateFieldOnBlur = (field: keyof typeof errors) => {
    switch (field) {
      case 'name':
        if (!name.trim()) {
          setErrors((prev) => ({ ...prev, name: 'Campo obligatorio' }));
        } else {
          setErrors((prev) => ({ ...prev, name: undefined }));
        }
        break;

      case 'email':
        if (!email.trim()) {
          setErrors((prev) => ({ ...prev, email: 'Campo obligatorio' }));
        } else {
          setErrors((prev) => ({ ...prev, email: undefined }));
        }
        break;

      case 'phone':
        if (!phone.trim()) {
          setErrors((prev) => ({ ...prev, phone: 'Campo obligatorio' }));
        } else {
          const normalized = phone.replace(/\s+/g, '');
          if (!/^[9][0-9]{8}$/.test(normalized)) {
            setErrors((prev) => ({ ...prev, phone: 'Debe ser 9 dígitos y empezar con 9' }));
          } else {
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }
        }
        break;

      case 'password':
        if (!password) {
          setErrors((prev) => ({ ...prev, password: 'Campo obligatorio' }));
        } else if (password.length < 8 || password.length > 15) {
          setErrors((prev) => ({ ...prev, password: 'Debe tener entre 8 y 15 caracteres' }));
        } else {
          setErrors((prev) => ({ ...prev, password: undefined }));
        }
        break;

      case 'confirmPassword':
        if (!confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: 'Campo obligatorio' }));
        } else if (confirmPassword !== password) {
          setErrors((prev) => ({ ...prev, confirmPassword: 'No coincide con la contraseña' }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
        break;

      case 'experience':
        if (!experience.trim()) {
          setErrors((prev) => ({ ...prev, experience: 'Campo obligatorio' }));
        } else if (isNaN(Number(experience)) || Number(experience) < 0) {
          setErrors((prev) => ({ ...prev, experience: 'Debe ser un número válido' }));
        } else {
          setErrors((prev) => ({ ...prev, experience: undefined }));
        }
        break;

      case 'walkerType':
        if (!walkerType) {
          setErrors((prev) => ({ ...prev, walkerType: 'Campo obligatorio' }));
        } else {
          setErrors((prev) => ({ ...prev, walkerType: undefined }));
        }
        break;

      case 'zone':
        if (!zone) {
          setErrors((prev) => ({ ...prev, zone: 'Campo obligatorio' }));
        } else {
          setErrors((prev) => ({ ...prev, zone: undefined }));
        }
        break;

      case 'description':
        if (!description.trim()) {
          setErrors((prev) => ({ ...prev, description: 'Campo obligatorio' }));
        } else {
          setErrors((prev) => ({ ...prev, description: undefined }));
        }
        break;

      case 'photoUri':
        if (!photoUri) {
          setErrors((prev) => ({ ...prev, photoUri: 'Debe seleccionar una foto' }));
        } else {
          setErrors((prev) => ({ ...prev, photoUri: undefined }));
        }
        break;
    }
  };

  // ─── Función para abrir selector de imágenes ────────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, photoUri: undefined }));
    }
  };

  // ─── Al hacer “Enviar”, validamos y, si todo está OK, armamos FormData ─────────────────────────────
  const validateAndSubmit = async () => {
    if (!validateAllFields()) {
      return; // Si hay errores, detenemos aquí
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', name.trim());
      form.append('email', email.trim());
      form.append('phone', phone.trim());
      form.append('password', password);
      form.append('confirm_password', confirmPassword);
      form.append('experience', String(Number(experience)));
      form.append('walker_type', walkerType);
      form.append('zone', zone);
      form.append('description', description.trim());

      // Tomamos extensión de la URI para el archivo
      const uriParts = photoUri!.split('.');
      const fileExt = uriParts[uriParts.length - 1];
      form.append('photo', {
        uri: Platform.OS === 'android' ? photoUri : photoUri!.replace('file://', ''),
        name: `photo.${fileExt}`,
        type: `image/${fileExt}`,
      } as any);

      await register_Walker(form);
      Alert.alert('Éxito', 'Paseador registrado correctamente.');
      // Opcional: limpiar campos o navegar atrás
      // resetAllFields();
    } catch (err: any) {
      console.error('Error al registrar paseador:', err);
      Alert.alert('Error', err.message || 'No se pudo registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Registrar Paseador" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* ─── Selector de Foto ──────────────────────────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.photoText}>Seleccionar Foto</Text>
          )}
        </TouchableOpacity>
        {errors.photoUri && <Text style={styles.errorText}>{errors.photoUri}</Text>}

        {/* ─── Campo: Nombre ─────────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            onBlur={() => validateFieldOnBlur('name')}
            placeholder="Ej. Juan Pérez"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* ─── Campo: Email ──────────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => validateFieldOnBlur('email')}
            placeholder="ejemplo@dominio.com"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* ─── Campo: Teléfono ────────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            onBlur={() => validateFieldOnBlur('phone')}
            placeholder="(9)23342234"
            maxLength={9}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* ─── Campo: Contraseña ───────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onBlur={() => validateFieldOnBlur('password')}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* ─── Campo: Confirmar Contraseña ───────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onBlur={() => validateFieldOnBlur('confirmPassword')}
            placeholder="Debe coincidir"
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* ─── Campo: Experiencia ──────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Experiencia (años)</Text>
          <TextInput
            style={[styles.input, errors.experience && styles.inputError]}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            onBlur={() => validateFieldOnBlur('experience')}
            placeholder="Ej. 2"
            maxLength={2}
          />
          {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
        </View>

        {/* ─── Campo: Tipo de paseador (Picker) ────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo de paseador</Text>
          <View
            style={[
              styles.pickerContainer,
              errors.walkerType && styles.pickerError,
            ]}
          >
            <Picker
              selectedValue={walkerType}
              onValueChange={(val) => {
                setWalkerType(val as 'Fijo' | 'Esporádico' | '');
                setErrors((prev) => ({ ...prev, walkerType: undefined }));
              }}
              onBlur={() => validateFieldOnBlur('walkerType')}
            >
              <Picker.Item label="Seleccione..." value="" />
              <Picker.Item label="Fijo" value="Fijo" />
              <Picker.Item label="Esporádico" value="Esporádico" />
            </Picker>
          </View>
          {errors.walkerType && <Text style={styles.errorText}>{errors.walkerType}</Text>}
        </View>

        {/* ─── Campo: Zona (Picker) ────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Zona</Text>
          <View
            style={[styles.pickerContainer, errors.zone && styles.pickerError]}
          >
            <Picker
              selectedValue={zone}
              onValueChange={(val) => {
                setZone(val as 'Norte' | 'Centro' | 'Sur' | '');
                setErrors((prev) => ({ ...prev, zone: undefined }));
              }}
              onBlur={() => validateFieldOnBlur('zone')}
            >
              <Picker.Item label="Seleccione..." value="" />
              <Picker.Item label="Norte" value="Norte" />
              <Picker.Item label="Centro" value="Centro" />
              <Picker.Item label="Sur" value="Sur" />
            </Picker>
          </View>
          {errors.zone && <Text style={styles.errorText}>{errors.zone}</Text>}
        </View>

        {/* ─── Campo: Descripción ──────────────────────────────────────────────────────────────────────── */}
        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            onBlur={() => validateFieldOnBlur('description')}
            placeholder="Escribe una breve descripción..."
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* ─── Botón Enviar ──────────────────────────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={validateAndSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Registrar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ─── Foto ─────────────────────────────────────────────────────────────────────────────────────────────────
  photoPicker: {
    alignSelf: 'center',
    marginBottom: 8,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoText: {
    color: '#666',
    fontSize: 14,
  },

  // ─── Campo genérico ───────────────────────────────────────────────────────────────────────────────────────
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#DC3545',
  },

  // ─── Errores de validación ────────────────────────────────────────────────────────────────────────────────
  errorText: {
    color: '#DC3545',
    fontSize: 13,
    marginTop: 4,
  },

  // ─── Picker ─────────────────────────────────────────────────────────────────────────────────────────────────
  pickerContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  pickerError: {
    borderColor: '#DC3545',
  },

  // ─── Botón Enviar ───────────────────────────────────────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: '#0096FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});