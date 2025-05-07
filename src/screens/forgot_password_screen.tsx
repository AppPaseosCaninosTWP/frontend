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
  import { useNavigation } from '@react-navigation/native';
  import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { RootStackParamList } from '../navigation/stack_navigator';
  import { LinearGradient } from 'expo-linear-gradient';
  import { Ionicons } from '@expo/vector-icons';
  
  export default function ForgotPasswordScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const fade_anim = useRef(new Animated.Value(0)).current;
    const translate_anim = useRef(new Animated.Value(30)).current;
    const [email, set_email] = useState('');
  
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
  
    const validate_email = (email: string) => {
      return /\S+@\S+\.\S+/.test(email);
    };
  
    const handle_reset = () => {
      if (!validate_email(email)) {
        Alert.alert('Correo inválido', 'Por favor ingrese un correo electrónico válido.');
        return;
      }
      //TODO: Implementar la lógica para restablecimiento de contraseña
      Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
      navigation.goBack();
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
  
          <Text style={styles.title}>Recuperar contraseña</Text>
          <Text style={styles.subtitle}>Ingrese su correo y le enviaremos instrucciones.</Text>
  
          <TextInput
            style={styles.input_field}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={set_email}
            keyboardType="email-address"
          />
  
          <TouchableOpacity style={styles.send_button} onPress={handle_reset}>
            <Text style={styles.send_text}>Enviar correo</Text>
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
      width: 50,
      height: 50,
      resizeMode: 'contain',
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
  