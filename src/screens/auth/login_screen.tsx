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
import { login_user } from '../../service/auth_service';
import { save_session } from '../../utils/token_service';


export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fade_anim = useRef(new Animated.Value(0)).current;
  const translate_anim = useRef(new Animated.Value(30)).current;

  const [email, set_email] = useState('');
  const [password, set_password] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
      set_email(value);
      const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        setEmailError('El correo electrónico es obligatorio');
      }
      else if (!email_regex.test(value)) {
        setEmailError('Ingrese un correo electrónico válido');
      } else {
        setEmailError('');
      }
    };

  const validatePassword = (value: string) => {
    set_password(value);
    if (!value) {
      setPasswordError('La contraseña es obligatoria');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {

    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) {
      Alert.alert('Error al iniciar sesión', 'Por favor complete todos los campos correctamente');
      return;
    }
  
    try {
      const { token, user } = await login_user(email, password);
      await save_session(token, user);     
      Alert.alert('Sesión iniciada', `Bienvenido, ${user.email}`);
      navigation.replace('DashboardScreen');
    } catch (err: any) {
      console.error('Error desde login_user:', err);
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

        <Text style={styles.title}>Inicia sesión</Text>
        <Text style={styles.subtitle}>¡Bienvenido! Introduce tus datos a continuación y empieza.</Text>

        <TextInput
          style={styles.input_field}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={validateEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input_field}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={{ width: '100%' }}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot_password}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.login_button} onPress={handleLogin}>
          <Text style={styles.login_text}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footer_text}>
          ¿Necesita registrarse?{' '}
          <Text style={styles.footer_link} onPress={() => navigation.navigate('Register')}>
            ¡Regístrate aquí!
          </Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  dog_image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 80,
    left: 40,
    right: 0,
    bottom: 0,
  },
    errorText: {
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
  back_button: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  back_icon: {
    fontSize: 24,
    color: '#333',
  },
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
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1B1B1B',
  },
  subtitle: {
    fontSize: 20,
    color: '#808B9A',
    marginBottom: 20,
    textAlign: 'center',
  },
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
  forgot_password: {
    fontSize: 14,
    color: '#808B9A',
    marginBottom: 30,
    textAlign: 'left',
    width: '100%',
    fontWeight: '600',
    marginTop: 8, 
    textDecorationLine: 'underline',
  
  },
  login_button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  login_text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer_text: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  footer_link: {
    color: '#007BFF',
    fontWeight: '600',
  },
}
);

