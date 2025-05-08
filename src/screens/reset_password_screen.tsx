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
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  import { RootStackParamList } from '../navigation/stack_navigator';
  import { LinearGradient } from 'expo-linear-gradient';
  import { Ionicons } from '@expo/vector-icons';
  
  type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;
  
  export default function ResetPasswordScreen({ route, navigation }: Props) {
    const { email } = route.params;
    const fade_anim = useRef(new Animated.Value(0)).current;
    const translate_anim = useRef(new Animated.Value(30)).current;
  
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
  
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
  
    const handleReset = () => {
      if (password.length === 0 || confirm.length === 0) {
        Alert.alert('Campo vacío', 'Por favor ingresa tu contraseña.');
        return;
      }
  
      if (password.length < 6) {
        Alert.alert('Contraseña débil', 'Debe tener al menos 6 caracteres.');
        return;
      }
  
      if (password !== confirm) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }
  
      //TODO: Logica de backend para restablecer la contraseña
      Alert.alert('Contraseña actualizada', 'Ahora puedes iniciar sesión.');
      navigation.navigate('Login');
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
  
          <Text style={styles.title}>Nueva contraseña</Text>
          <Text style={styles.subtitle}>
            Para el correo: {'\n'}
            <Text style={{ fontWeight: '600' }}>{email}</Text>
          </Text>
  
          <TextInput
            style={styles.input_field}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input_field}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
  
          <TouchableOpacity style={styles.send_button} onPress={handleReset}>
            <Text style={styles.send_text}>Guardar</Text>
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
  