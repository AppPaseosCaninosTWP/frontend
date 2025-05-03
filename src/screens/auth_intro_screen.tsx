import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
  } from 'react-native';
  import { useEffect, useRef } from 'react';
  import { LinearGradient } from 'expo-linear-gradient';
  import { useNavigation } from '@react-navigation/native';
  import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { RootStackParamList } from '../navigation/stack_navigator';
  
  export default function AuthIntroScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
    const fade_anim = useRef(new Animated.Value(0)).current;
    const translate_anim = useRef(new Animated.Value(30)).current;
  
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
      <LinearGradient colors={['#0096FF', '#E6F4FF']} style={styles.background}>
        <Animated.View
          style={[
            styles.content_wrapper,
            {
              opacity: fade_anim,
              transform: [{ translateY: translate_anim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/menu_dog.png')}
            style={styles.dog_image}
            resizeMode="cover"
          />
  
          <View style={styles.card}>
            <View style={styles.icon_container}>
              <Image
                source={require('../../assets/icon_frame.png')}
                style={styles.icon}
              />
            </View>
  
            <View style={styles.separator_wrapper}>
              <View style={styles.separator_active} />
            </View>
  
            <Text style={styles.title}>Perfiles de mascotas personalizados</Text>
            <Text style={styles.description}>
              Crea perfiles personalizados para cada una de tus queridas mascotas en TWP. Comparte su nombre, raza y edad mientras te conectas con una comunidad vibrante.
            </Text>
  
            <TouchableOpacity
              style={styles.login_button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.login_text}>Iniciar sesión</Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.register_text}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }
  

  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    content_wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
            
    safe_area: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
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
      backgroundColor: '#F7F7F9',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 60,
      paddingBottom: 40,
      paddingHorizontal: 24,
      alignItems: 'center',
      height: '50%',
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
    separator_wrapper: {
      alignItems: 'center',
      marginBottom: 12,
    },
    separator_active: {
      width: 60,
      height: 4,
      backgroundColor: '#FFC107',
      borderRadius: 2,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#1B1B1B',
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      fontSize: 19,
      color: '#808B9A',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
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
    register_text: {
      fontSize: 14,
      color: '#8A8A8A',
      textDecorationLine: 'underline',
    },
  });
  
  


  

  