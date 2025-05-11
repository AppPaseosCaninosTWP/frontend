import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/main/welcome_screen';
import AuthIntroScreen from '../screens/auth/auth_intro_screen';
import LoginScreen from '../screens/auth/login_screen';
import RegisterScreen from '../screens/auth/register_screen';
import ForgotPasswordScreen from '../screens/auth/forgot_password_screen';
import VerifyCodeScreen from '../screens/auth/verify_code_screen';
import ResetPasswordScreen from '../screens/auth/reset_password_screen';
import DashboardPaseadorScreen from '../screens/main/dashboard/dashboard_paseador_screen';
import DashboardAdminScreen from '../screens/main/dashboard/dashboard_admin_screen';
import DashboardClienteScreen from '../screens/main/dashboard/dashboard_cliente_screen';
import DashboardScreen from '../screens/main/dashboard/dashboard_screen'; 
import StepBreedScreen from '../screens/main/create_pet/step_breed_screen';
import StepZonaScreen from '../screens/main/create_pet/step_zona_screen';


export type RootStackParamList = {
  Welcome: undefined;
  AuthIntro: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string; context: 'register' | 'reset' };
  ResetPassword: { email: string };
  DashboardAdmin: undefined;
  DashboardCliente: undefined;
  DashboardPaseador: undefined;
  DashboardScreen: undefined;
  StepBreedScreen: undefined;
  StepZonaScreen: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthIntro" component={AuthIntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="DashboardCliente" component={DashboardClienteScreen} />
      <Stack.Screen name="DashboardPaseador" component={DashboardPaseadorScreen} />
      <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="StepZonaScreen" component={StepZonaScreen} />
      <Stack.Screen name="StepBreedScreen" component={StepBreedScreen} />
    </Stack.Navigator>
  );
}


