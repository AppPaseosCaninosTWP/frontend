// src/screens/paseador/EditWalkerProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EditWalkerProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState('walker@example.com');
  const [phone, setPhone] = useState('+56 9 12345678');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (!email || !phone || !description || !image) {
      Alert.alert('Campos requeridos', 'Todos los campos son obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Formato inválido', 'El correo debe tener un formato válido.');
      return;
    }

    const phoneRegex = /^\+?56\s?9\d{8}$/; // formato chileno
    if (!phoneRegex.test(phone)) {
      Alert.alert('Formato inválido', 'El número debe tener formato chileno (+56 9XXXXXXXX).');
      return;
    }

    if (description.length > 250) {
      Alert.alert('Límite excedido', 'La descripción debe tener máximo 250 caracteres.');
      return;
    }

    Alert.alert('Cambios enviados', 'Tus datos están pendientes de aprobación.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi perfil</Text>
      </View>

      <View style={styles.imagePicker}>
        <Image
          source={image ? { uri: image } : require('../../../assets/user_icon.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={email}
        onChangeText={setEmail}
        editable={isEditing}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Teléfono móvil</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={phone}
        onChangeText={setPhone}
        editable={isEditing}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Descripción (máx 250 caracteres)</Text>
      <TextInput
        style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
        value={description}
        onChangeText={setDescription}
        editable={isEditing}
        multiline
        maxLength={250}
      />

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Editar datos</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111',
    textAlign: 'center',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
    marginHorizontal: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginHorizontal: 16,
  },
  editButton: {
    backgroundColor: '#0096ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#70c72a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
