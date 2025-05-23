import React, { useEffect, useState } from 'react';
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
import { get_token, get_user } from '../../../utils/token_service';
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface WalkerProfile {
  walker_id:   number;
  name:        string;
  email:       string;
  phone:       string;
  experience:  number;
  walker_type: string;
  zone:        string;
  description: string;
  balance:     number;
  on_review:   boolean;
  photo_url:    string;
}

export default function EditWalkerProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [walkerType, setWalkerType] = useState('');
  const [zone, setZone] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');
  const [profile, setProfile] = useState<WalkerProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await get_token();
        const user = await get_user();
        if (!token || !user?.id) throw new Error('Sesión no válida');
        setUserId(user.id);

        const res = await fetch(`${API_BASE_URL}/walker_profile/get_profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const { data: profile } = await res.json();
        setProfile(profile);

        setName(profile.name);
        setExperience(String(profile.experience));
        setWalkerType(profile.walker_type);
        setZone(profile.zone);

        // Setear datos editables
        setEmail(profile.email);
        setOriginalEmail(profile.email);

        let fmtPhone = profile.phone;
        if (!fmtPhone.startsWith('+56 9')) {
          fmtPhone = `+56 9${fmtPhone.replace(/\D/g, '').slice(-8)}`;
        }
        setPhone(fmtPhone);
        setOriginalPhone(fmtPhone);

        setDescription(profile.description);
        setOriginalDescription(profile.description);

        if (profile.photo_url) {
          setImage(profile.photo_url.startsWith('http')
          ? profile.photo_url
          : `${API_BASE_URL.replace(/\/$/, "")}/uploads/${profile.photo_url}`
          );
      }
      } catch (err) {
        Alert.alert('Error', (err as Error).message);
      }
    };
    fetchProfile();
  }, []);

const handleSubmit = async () => {
  if (!email || !phone || !description) {
    Alert.alert('Campos requeridos', 'Email, teléfono y descripción son obligatorios.');
    return;
  }

  const raw = phone.replace(/\D/g, '');
  const e164 = `+${raw}`;

  try {
    const token = await get_token();
    if (!token || !userId) throw new Error('Sesión no válida');

    const formData = new FormData();
    formData.append('email', email.trim());
    formData.append('phone', e164);
    formData.append('description', description.trim());

    if (image && image !== profile?.photo_url) {
      const uriParts = image.split('/');
      const filename = uriParts[uriParts.length - 1];
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri: image,
        name: filename,
        type: mimeType,
      } as any);
    }

    const res = await fetch(
      `${API_BASE_URL.replace(/\/$/, '')}/walker_profile/update_walker_profile/${userId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const payload = await res.json();
    if (!res.ok) {
      Alert.alert('Error al actualizar', payload.msg);
      return;
    }

    Alert.alert('Éxito', 'Tus datos están pendientes de aprobación.');
    setIsEditing(false);
  } catch (err) {
    Alert.alert('Error', (err as Error).message);
  }
};

  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Necesito acceso a tus fotos para cambiar la imagen.');
    return;
  }
  // Abre galería
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled && result.assets.length > 0) {
  setImage(result.assets[0].uri);
  }
};

  const handleCancel = () => {
    setEmail(originalEmail);
    setPhone(originalPhone);
    setDescription(originalDescription);
    setIsEditing(false);
    setEmailError('');
    setPhoneError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil del paseador</Text>
      </View>

<View style={styles.imagePicker}>
  <TouchableOpacity
    onPress={isEditing ? pickImage : undefined}
    activeOpacity={0.7}
  >
    <Image
      source={
        image
          ? { uri: image }
          : require('../../../assets/user_icon.png')
      }
      style={styles.image}
    />
    {isEditing && (
      <View style={styles.editOverlay}>
        <Feather name="camera" size={24} color="#fff" />
      </View>
    )}
  </TouchableOpacity>
</View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={name} editable={false} />

      <Text style={styles.label}>Años de experiencia</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={experience} editable={false} />

      <Text style={styles.label}>Tipo de paseador</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={walkerType} editable={false} />

      <Text style={styles.label}>Zona</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={zone} editable={false} />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={email}
        onChangeText={setEmail}
        editable={isEditing}
        keyboardType="email-address"
      />
      {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <Text style={styles.label}>Teléfono móvil</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={phone}
        onChangeText={setPhone}
        editable={isEditing}
        keyboardType="phone-pad"
      />
      {!!phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

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
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
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
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  editButton: {
    backgroundColor: '#0099ad',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#70c72a',
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
  paddingBottom: 40,
  backgroundColor: '#fff',
},
selectInput: {
  justifyContent: 'center',
},
optionsContainer: {
  marginHorizontal: 16,
  backgroundColor: '#f9f9f9',
  borderRadius: 10,
  paddingVertical: 8,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#ccc',
  color: '#999',
},
optionButton: {
  paddingVertical: 10,
  paddingHorizontal: 12,
},
optionText: {
  fontSize: 14,
  color: '#333',
},
errorText: {
  color: 'red',
  fontSize: 12,
  marginTop: -10,
  marginBottom: 10,
  marginHorizontal: 16,
},
imagePicker: {
    // asegúrate de tener posición relativa
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  // nuevo overlay para el icono de cámara
  editOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
});