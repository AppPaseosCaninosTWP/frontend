import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/welcome_screen';
import AuthIntroScreen from '../screens/auth_intro_screen';
import LoginScreen from '../screens/login_screen';
import RegisterScreen from '../screens/register_screen';

export type RootStackParamList = {
  Welcome: undefined;
  AuthIntro: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthIntro" component={AuthIntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}


