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
import StepAgeScreen from '../screens/main/create_pet/step_age_screen';
import StepHealthScreen from '../screens/main/create_pet/step_health_screen';
import StepConfirmScreen from '../screens/main/create_pet/step_confirm_screen';
import UserScreen from '../screens/main/Admin/user_screen';
import AvailableWalksScreen from '../screens/main/walker/available_walks_screen';
import WalkHistoryScreen from '../screens/main/walker/walk_history_screen';
import PetProfileScreen from '../screens/main/walker/pet_profile_screen';
import type { Walk } from '../screens/main/walker/available_walks_screen';
import RatingsScreen from '../screens/main/walker/ratings_screen';
import WalkerProfileScreen from '../screens/main/walker/walker_profile_screen';
import StepNameScreen from '../screens/main/create_pet/step_name_screen';

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
  StepNameScreen: undefined;
  StepAgeScreen: undefined;
  StepHealthScreen: undefined;
  StepConfirmScreen: undefined;
  UserScreen: undefined;
  AvailableWalksScreen: undefined;
  WalkHistoryScreen: undefined;
  PetProfileScreen: { walk: Walk };
  RatingsScreen: undefined
  WalkerProfileScreen: undefined;
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
      <Stack.Screen name="StepNameScreen" component={StepNameScreen} />
      <Stack.Screen name="StepAgeScreen" component={StepAgeScreen} />
      <Stack.Screen name="StepHealthScreen" component={StepHealthScreen} />
      <Stack.Screen name="StepConfirmScreen" component={StepConfirmScreen} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="AvailableWalksScreen" component={AvailableWalksScreen} />
      <Stack.Screen name="WalkHistoryScreen" component={WalkHistoryScreen} />
      <Stack.Screen name="PetProfileScreen" component={PetProfileScreen} />
      <Stack.Screen name="RatingsScreen" component={RatingsScreen} />
      <Stack.Screen name="WalkerProfileScreen" component={WalkerProfileScreen} />
    </Stack.Navigator>
  );
}


