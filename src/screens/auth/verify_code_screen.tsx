import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stack_navigator';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { verify_reset_code } from '../../service/auth_service';

export default function Verify_code_screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email, context } = route.params as { email: string; context: 'reset' | 'register' };

  const fade_anim = useRef(new Animated.Value(0)).current;
  const translate_anim = useRef(new Animated.Value(30)).current;

  const [code, set_code] = useState('');

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

  const handle_verify = async () => {
    if (code.length === 0) {
      Alert.alert('Campo vacío', 'Por favor ingrese el código.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Código inválido', 'Debe tener 6 dígitos.');
      return;
    }

    try {
      await verify_reset_code(email, code);

      if (context === 'reset') {
        Alert.alert('Código verificado', 'Ahora puedes cambiar tu contraseña.');
        navigation.navigate('ResetPassword', { email, code });
      } else if (context === 'register') {
        Alert.alert('Correo validado', 'Ahora puedes iniciar sesión');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

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

        <Text style={styles.title}>Verificar código</Text>
        <Text style={styles.subtitle}>
          Ingrese el código que enviamos a{' '}
          <Text style={{ fontWeight: '600' }}>{email}</Text>
        </Text>

        <TextInput
          style={styles.input_field}
          placeholder="Código de verificación"
          value={code}
          onChangeText={set_code}
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.send_button} onPress={handle_verify}>
          <Text style={styles.send_text}>Verificar</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1B1B1B',
  },
  subtitle: {
    fontSize: 18,
    color: '#808B9A',
    marginBottom: 24,
    textAlign: 'center',
  },
  input_field: {
    backgroundColor: '#F8F9FB',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    letterSpacing: 4,
  },
  send_button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  send_text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

  