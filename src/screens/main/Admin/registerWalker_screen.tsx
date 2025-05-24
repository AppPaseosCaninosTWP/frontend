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
import HeaderAdmin from '../../../components/shared/header_admin';
import { registerWalker } from '../../../service/auth_service';

export default function RegisterWalkerScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [walkerType, setWalkerType] = useState('');
  const [zone, setZone] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    }
  };

  const validateAndSubmit = async () => {
    // validaciones básicas
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !experience ||
      !walkerType ||
      !zone ||
      !description ||
      !photoUri
    ) {
      return Alert.alert('Error', 'Todos los campos son obligatorios.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden.');
    }
    const expNum = Number(experience);
    if (isNaN(expNum) || expNum < 0) {
      return Alert.alert('Error', 'Experiencia inválida.');
    }

    setLoading(true);
    try {
      // construimos FormData
      const form = new FormData();
      form.append('name', name.trim());
      form.append('email', email.trim());
      form.append('phone', phone.trim());
      form.append('password', password);
      form.append('confirm_password', confirmPassword);
      form.append('experience', String(expNum));
      form.append('walker_type', walkerType.trim());
      form.append('zone', zone.trim());
      form.append('description', description.trim());

      // para el fichero, extraemos la extensión
      const uriParts = photoUri.split('.');
      const fileExt = uriParts[uriParts.length - 1];
      form.append('photo', {
        uri: Platform.OS === 'android' ? photoUri : photoUri.replace('file://', ''),
        name: `photo.${fileExt}`,
        type: `image/${fileExt}`,
      } as any);

      await registerWalker(form);
      Alert.alert('Éxito', 'Paseador registrado correctamente.');
      // opcional: limpiar campos o navegar atrás
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
        <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.photoText}>Seleccionar Foto</Text>
          )}
        </TouchableOpacity>

        {[
          { label: 'Nombre', value: name, onChange: setName, keyboard: 'default' },
          {
            label: 'Email',
            value: email,
            onChange: setEmail,
            keyboard: 'email-address',
          },
          { label: 'Teléfono', value: phone, onChange: setPhone, keyboard: 'phone-pad' },
          { label: 'Contraseña', value: password, onChange: setPassword, secure: true },
          {
            label: 'Confirmar contraseña',
            value: confirmPassword,
            onChange: setConfirmPassword,
            secure: true,
          },
          {
            label: 'Experiencia (años)',
            value: experience,
            onChange: setExperience,
            keyboard: 'numeric',
          },
          {
            label: 'Tipo de paseador',
            value: walkerType,
            onChange: setWalkerType,
            keyboard: 'default',
          },
          { label: 'Zona', value: zone, onChange: setZone, keyboard: 'default' },
        ].map((f) => (
          <View key={f.label} style={styles.field}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={styles.input}
              value={f.value}
              onChangeText={f.onChange}
              keyboardType={f.keyboard as any}
              secureTextEntry={!!f.secure}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={validateAndSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Registrar</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 16, paddingBottom: 40 },
  photoPicker: {
    alignSelf: 'center',
    marginBottom: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoText: { color: '#666', fontSize: 14 },

  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
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
  textArea: { height: 100, textAlignVertical: 'top' },

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
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
