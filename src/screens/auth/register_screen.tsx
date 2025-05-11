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
  import { register_user } from '../../service/auth_service';
  import { send_code } from '../../service/auth_service';

  
  export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
    const fade_anim = useRef(new Animated.Value(0)).current;
    const translate_anim = useRef(new Animated.Value(30)).current;
  
    const [email, set_email] = useState('');
    const [phone, set_phone] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');

    const handleRegister = async () => {
      if (!email || !phone || !password || !confirm_password) {
        Alert.alert('Error al crear cuenta', 'Todos los campos son obligatorios');
        return;
      }
    
      const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phone_regex = /^\d{9}$/;
    
      if (!email_regex.test(email)) {
        Alert.alert('Correo inválido', 'Ingrese un correo electrónico válido.');
        return;
      }
    
      if (!phone_regex.test(phone)) {
        Alert.alert('Teléfono inválido', 'El número debe tener exactamente 8 dígitos.');
        return;
      }
    
      if (password.length < 8 || password.length > 15) {
        Alert.alert('Contraseña inválida', 'Debe tener entre 8 y 15 caracteres.');
        return;
      }
    
      if (password !== confirm_password) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
    
      try {
        const user = await register_user(email, phone, password, confirm_password);
      
        // Enviar código de validación por correo
        await send_code(user.email);
      
        // Redirigir a pantalla de verificación
        navigation.navigate('VerifyCode', {
          email: user.email,
          context: 'register',
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
            placeholder="Correo electrónico"
            value={email}
            onChangeText={set_email}
          />
  
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
              onChangeText={set_phone}
            />
          </View>
  
          <TextInput
            style={styles.input_field}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={set_password}
          />
  
          <TextInput
            style={styles.input_field}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirm_password}
            onChangeText={set_confirm_password}
          />
  
          <TouchableOpacity style={styles.register_button} onPress={handleRegister}>
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
      marginBottom: 10,
      color: '#1B1B1B',
    },
    subtitle: {
      fontSize: 18,
      color: '#808B9A',
      marginBottom: 10,
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
    flag_icon: {
      width: 24,
      height: 16,
      resizeMode: 'contain',
    },
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
    register_text: {
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
    prefix_wrapper: {
  paddingHorizontal: 12,
  paddingVertical: 12,
  borderRightWidth: 1,
  borderRightColor: '#E0E0E0',
  justifyContent: 'center',
  alignItems: 'center',
},
prefix_text: {
  fontSize: 16,
  color: '#1B1B1B',
},

  });
  