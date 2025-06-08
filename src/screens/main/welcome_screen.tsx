import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stack_navigator';

const { height: window_height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dog_position = useRef(new Animated.Value(window_height)).current;

  useEffect(() => {
    Animated.timing(dog_position, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.replace('auth_intro');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={['#63B3ED', '#E0F2FE']} style={styles.background_gradient}>
      <Text style={styles.welcome_title}>PTW</Text>
      <Animated.Image
        source={require('../../assets/menu_dog.png')}
        style={[styles.dog_image, { transform: [{ translateY: dog_position }] }]}
        resizeMode="cover"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background_gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  welcome_title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 4,
  },
  dog_image: {
    width: '200%',
    height: window_height * 0.75,
    position: 'absolute',
    bottom: -50,
  },
});

