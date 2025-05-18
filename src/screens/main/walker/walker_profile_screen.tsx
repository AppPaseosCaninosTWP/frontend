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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
  const [showZoneOptions, setShowZoneOptions] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalExperience, setOriginalExperience] = useState('');
  const [originalWalkerType, setOriginalWalkerType] = useState('');
  const [originalZone, setOriginalZone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await get_token();
        const user = await get_user();

        if (!token || !user || !user.id) {
          throw new Error('Sesión no válida o ID no disponible');
        }

        setUserId(user.id);

        const res = await fetch(`${API_BASE_URL}/walker_profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const msg = `Código ${res.status}: ${res.statusText}`;
          throw new Error(`No se pudo obtener el perfil\n${msg}`);
        }

        const data = await res.json();
        const profile = data.data;

        setEmail(user.email || '');
        setOriginalEmail(user.email || '');

        let formattedPhone = user.phone || '';
        if (!formattedPhone.startsWith('+56 9')) {
          formattedPhone = `+56 9${formattedPhone.replace(/[^0-9]/g, '').slice(-8)}`;
        }
        setPhone(formattedPhone);
        setOriginalPhone(formattedPhone);

        setDescription(profile.description || '');
        setOriginalDescription(profile.description || '');

        setName(profile.name || '');
        setOriginalName(profile.name || '');

        setExperience(profile.experience?.toString() || '');
        setOriginalExperience(profile.experience?.toString() || '');

        setWalkerType(profile.walker_type || '');
        setOriginalWalkerType(profile.walker_type || '');

        setZone(profile.zone || '');
        setOriginalZone(profile.zone || '');

        if (profile.photo) {
          setImage(`${API_BASE_URL}/${profile.photo}`);
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!email || !phone || !description || !name || !experience || !walkerType || !zone) {
      Alert.alert('Campos requeridos', 'Todos los campos son obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?56\s?9\d{8}$/;

    const emailValid = emailRegex.test(email);
    const phoneValid = phoneRegex.test(phone);

    setEmailError(emailValid ? '' : 'Formato de correo inválido');
    setPhoneError(phoneValid ? '' : 'Teléfono debe ser formato +56 9XXXXXXXX');

    if (!emailValid || !phoneValid) {
      Alert.alert('Error de validación', 'Ajuste los campos con errores para continuar.');
      return;
    }

    if (description.length > 250) {
      Alert.alert('Límite excedido', 'La descripción debe tener máximo 250 caracteres.');
      return;
    }

    try {
      const token = await get_token();
      if (!token || !userId) throw new Error('Sesión no válida');

      const res = await fetch(`${API_BASE_URL}/walker_profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, phone, description, name, experience, walker_type: walkerType, zone }),
      });

      if (!res.ok) throw new Error('Error al actualizar los datos');

      Alert.alert('Éxito', 'Tus datos están pendientes de aprobación.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleCancel = () => {
    setEmail(originalEmail);
    setPhone(originalPhone);
    setDescription(originalDescription);
    setName(originalName);
    setExperience(originalExperience);
    setWalkerType(originalWalkerType);
    setZone(originalZone);
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
        <Image
          source={image ? { uri: image } : require('../../../assets/user_icon.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabledInput]}
        value={name}
        onChangeText={setName}
        editable={isEditing}
      />

      <Text style={styles.label}>Años de experiencia</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={experience}
        editable={false}
        keyboardType="numeric"
      />


      <Text style={styles.label}>Tipo de paseador</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={walkerType}
        editable={false}
      />


      <Text style={styles.label}>Zona de Antofagasta</Text>
      <TouchableOpacity
        style={[styles.input, styles.selectInput, !isEditing && styles.disabledInput]}
        onPress={() => isEditing && setShowZoneOptions(true)}
        activeOpacity={isEditing ? 0.7 : 1}
      >
      <Text style={{ color: zone ? '#999' : '#333' }}>
        {zone || 'Selecciona una zona'}
      </Text>
      </TouchableOpacity>

      {showZoneOptions && (
      <View style={styles.optionsContainer}>
        {['Norte', 'Centro', 'Sur'].map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setZone(option);
            setShowZoneOptions(false);
          }}
          style={styles.optionButton}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}



      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
  style={[styles.input, !isEditing && styles.disabledInput]}
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? '' : 'Formato de correo inválido');
  }}
  editable={isEditing}
  keyboardType="email-address"
  autoCapitalize="none"
/>
{emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}


      <Text style={styles.label}>Teléfono móvil</Text>
      <TextInput
  style={[styles.input, !isEditing && styles.disabledInput]}
  value={phone}
  onChangeText={(text) => {
    setPhone(text);
    const phoneRegex = /^\+?56\s?9\d{8}$/;
    setPhoneError(phoneRegex.test(text) ? '' : 'Teléfono debe ser formato +56 9XXXXXXXX');
  }}
  editable={isEditing}
  keyboardType="phone-pad"
/>
{phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}


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
});