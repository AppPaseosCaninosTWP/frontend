import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stack_navigator';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { register_user, send_code } from '../../service/auth_service';

export default function Register_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fade_anim = useRef(new Animated.Value(0)).current;
  const translate_anim = useRef(new Animated.Value(30)).current;

  const [name, set_name] = useState('');
  const [email, set_email] = useState('');
  const [phone, set_phone] = useState('');
  const [password, set_password] = useState('');
  const [confirm_password, set_confirm_password] = useState('');

  const [email_error, set_email_error] = useState('');
  const [phone_error, set_phone_error] = useState('');
  const [password_error, set_password_error] = useState('');
  const [confirm_password_error, set_confirm_password_error] = useState('');

  const [password_touched, set_password_touched] = useState(false);
  const [confirm_password_touched, set_confirm_password_touched] = useState(false);

  const validate_email = (value: string) => {
    set_email(value);
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      set_email_error('El correo electrónico es obligatorio');
    } else if (!email_regex.test(value)) {
      set_email_error('Ingrese un correo electrónico válido');
    } else {
      set_email_error('');
    }
  };

  const validate_phone = (value: string) => {
    set_phone(value);
    const phone_regex = /^\d{9}$/;
    if (!value) {
      set_phone_error('El número de teléfono es obligatorio');
    } else if (!phone_regex.test(value)) {
      set_phone_error('El número debe tener exactamente 9 dígitos');
    } else {
      set_phone_error('');
    }
  };

  const validate_password = (value: string) => {
    set_password(value);
    if (!value) {
      set_password_error('La contraseña es obligatoria');
    } else if (value.length < 8 || value.length > 15) {
      set_password_error('La contraseña debe tener entre 8 y 15 caracteres');
    } else {
      set_password_error('');
    }
  };

  const validate_confirm_password = (value: string) => {
    set_confirm_password(value);
    if (!value) {
      set_confirm_password_error('La confirmación de contraseña es obligatoria');
    } else if (value !== password) {
      set_confirm_password_error('Las contraseñas no coinciden');
    } else {
      set_confirm_password_error('');
    }
  };

const handle_register = async () => {
  const trimmed_name = name.trim();
  const trimmed_email = email.trim();
  const trimmed_phone = phone.trim();
  const trimmed_password = password.trim();
  const trimmed_confirm_password = confirm_password.trim();

  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone_regex = /^\d{9}$/;

  let local_email_error = '';
  let local_phone_error = '';
  let local_password_error = '';
  let local_confirm_password_error = '';

  if (!trimmed_email) {
    local_email_error = 'El correo electrónico es obligatorio';
  } else if (!email_regex.test(trimmed_email)) {
    local_email_error = 'Ingrese un correo electrónico válido';
  }

  if (!trimmed_phone) {
    local_phone_error = 'El número de teléfono es obligatorio';
  } else if (!phone_regex.test(trimmed_phone)) {
    local_phone_error = 'El número debe tener exactamente 9 dígitos';
  }

  if (!trimmed_password) {
    local_password_error = 'La contraseña es obligatoria';
  } else if (trimmed_password.length < 8 || trimmed_password.length > 15) {
    local_password_error = 'La contraseña debe tener entre 8 y 15 caracteres';
  }

  if (!trimmed_confirm_password) {
    local_confirm_password_error = 'La confirmación de contraseña es obligatoria';
  } else if (trimmed_confirm_password !== trimmed_password) {
    local_confirm_password_error = 'Las contraseñas no coinciden';
  }

  set_email_error(local_email_error);
  set_phone_error(local_phone_error);
  set_password_error(local_password_error);
  set_confirm_password_error(local_confirm_password_error);

  set_password_touched(true);
  set_confirm_password_touched(true);

  if (
    local_email_error ||
    local_phone_error ||
    local_password_error ||
    local_confirm_password_error
  ) {
    Alert.alert('Error', 'Por favor corrija los errores antes de continuar.');
    return;
  }

try {
  const user = await register_user(
    trimmed_name,
    trimmed_email,
    trimmed_phone,
    trimmed_password,
    trimmed_confirm_password
  );

  if (!user?.email) {
    throw new Error('Error inesperado: El email no fue devuelto por el servidor');
  }

  navigation.navigate('VerifyCode', {
    email: user.email,
    phone: user.phone,
    context: 'register',
    token: user.pending_verification_token, // 👈 necesario
  });




} catch (err: any) {
  console.error('Error al registrarse:', err);
  Alert.alert('Error', err.message);
}

};



  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade_anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translate_anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0096FF', '#E6F4FF']} style={styles.container}>
      <Image
        source={require('../../assets/menu_dog.png')}
        style={styles.dog_image}
        resizeMode="cover"
      />

      <Animated.View
        style={[styles.card, { opacity: fade_anim, transform: [{ translateY: translate_anim }] }]}
      >
        <TouchableOpacity style={styles.back_button} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.icon_container}>
          <Image source={require('../../assets/user_icon.png')} style={styles.icon} />
        </View>

        <Text style={styles.title}>Crear una cuenta</Text>
        <Text style={styles.subtitle}>¡Bienvenido! Introduce tus datos a continuación y empieza.</Text>

        <TextInput
          style={styles.input_field}
          placeholder="Nombre"
          value={name}
          onChangeText={set_name}
        />

        <TextInput
          style={styles.input_field}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={validate_email}
        />
        {email_error ? <Text style={styles.error_text}>{email_error}</Text> : null}

        <View style={styles.phone_input_container}>
          <View style={styles.flag_wrapper}>
            <Image source={require('../../assets/flag_cl.png')} style={styles.flag_icon} />
            <Text style={styles.prefix_text}>+56</Text>
          </View>
          <TextInput
            style={styles.phone_input}
            placeholder="912345678"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={validate_phone}
          />
        </View>
        {phone_error ? <Text style={styles.error_text}>{phone_error}</Text> : null}

        <TextInput
          style={styles.input_field}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={validate_password}
          onBlur={() => set_password_touched(true)}
        />
        {password_error && password_touched ? <Text style={styles.error_text}>{password_error}</Text> : null}

        <TextInput
          style={styles.input_field}
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={confirm_password}
          onChangeText={validate_confirm_password}
          onBlur={() => set_confirm_password_touched(true)}
        />
        {confirm_password_error && confirm_password_touched ? <Text style={styles.error_text}>{confirm_password_error}</Text> : null}

        <TouchableOpacity style={styles.register_button} onPress={handle_register}>
          <Text style={styles.register_text}>Crear cuenta</Text>
        </TouchableOpacity>

        <Text style={styles.footer_text}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.footer_link} onPress={() => navigation.navigate('Login')}>
            ¡Inicia sesión aquí!
          </Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  dog_image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 80,
    left: 40,
    right: 0,
    bottom: 0,
  },
  error_text: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  back_button: { position: 'absolute', left: 20, top: 20 },
  icon_container: {
    backgroundColor: '#fff',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -36,
    borderWidth: 4,
    borderColor: '#E6F4FF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: { width: 60, height: 60, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#1B1B1B' },
  subtitle: { fontSize: 18, color: '#808B9A', marginBottom: 10, textAlign: 'center' },
  input_field: {
    backgroundColor: '#F8F9FB',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  phone_input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    paddingRight: 12,
  },
  flag_wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag_icon: { width: 24, height: 16, resizeMode: 'contain' },
  phone_input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1B1B1B',
  },
  register_button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  register_text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer_text: { fontSize: 14, color: '#8A8A8A' },
  footer_link: { color: '#007BFF', fontWeight: '600' },
  prefix_text: { fontSize: 16, color: '#1B1B1B' },
});
  