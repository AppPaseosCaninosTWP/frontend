import { createNativeStackNavigator } from '@react-navigation/native-stack';

import welcome_screen from '../screens/main/welcome_screen';
import auth_intro_screen from '../screens/auth/auth_intro_screen';
import login_screen from '../screens/auth/login_screen';
import register_screen from '../screens/auth/register_screen';
import forgot_password_screen from '../screens/auth/forgot_password_screen';
import verify_code_screen from '../screens/auth/verify_code_screen';
import reset_password_screen from '../screens/auth/reset_password_screen';

import dashboard_paseador_screen from '../screens/main/dashboard/dashboard_paseador_screen';
import dashboard_admin_screen from '../screens/main/dashboard/dashboard_admin_screen';
import dashboard_cliente_screen from '../screens/main/dashboard/dashboard_cliente_screen';
import dashboard_screen from '../screens/main/dashboard/dashboard_screen';

import step_breed_screen from '../screens/main/create_pet/step_breed_screen';
import step_zona_screen from '../screens/main/create_pet/step_zona_screen';
import step_name_screen from '../screens/main/create_pet/step_name_screen';
import step_age_screen from '../screens/main/create_pet/step_age_screen';
import step_health_screen from '../screens/main/create_pet/step_health_screen';
import step_confirm_screen from '../screens/main/create_pet/step_confirm_screen';
import success_screen from '../screens/main/create_pet/success_screen';

import user_screen from '../screens/main/Admin/user_screen';
import walks_screen from '../screens/main/Admin/walks_screen';
import payments_screen from '../screens/main/Admin/payments_screen';

import available_walks_screen from '../screens/main/walker/available_walks_screen';
import walk_history_screen from '../screens/main/walker/walk_history_screen';
import pet_profile_screen from '../screens/main/walker/pet_profile_screen';
import ratings_screen from '../screens/main/walker/ratings_screen';
import walker_profile_screen from '../screens/main/walker/walker_profile_screen';
import planner_screen from '../screens/main/walker/planner_screen';

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
  SuccessScreen: undefined;
  UserScreen: undefined;
  WalksScreen: undefined;
  PaymentsScreen: undefined;
  AvailableWalksScreen: undefined;
  WalkHistoryScreen: undefined;
  PetProfileScreen: {
    walkId: number;
    petId: number;
    duration: number;
  };
  RatingsScreen: undefined;
  WalkerProfileScreen: undefined;
  PlannerScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function stack_navigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={welcome_screen} />
      <Stack.Screen name="AuthIntro" component={auth_intro_screen} />
      <Stack.Screen name="Login" component={login_screen} />
      <Stack.Screen name="Register" component={register_screen} />
      <Stack.Screen name="ForgotPassword" component={forgot_password_screen} />
      <Stack.Screen name="VerifyCode" component={verify_code_screen} />
      <Stack.Screen name="ResetPassword" component={reset_password_screen} />
      <Stack.Screen name="DashboardCliente" component={dashboard_cliente_screen} />
      <Stack.Screen name="DashboardPaseador" component={dashboard_paseador_screen} />
      <Stack.Screen name="DashboardAdmin" component={dashboard_admin_screen} />
      <Stack.Screen name="DashboardScreen" component={dashboard_screen} />
      <Stack.Screen name="StepBreedScreen" component={step_breed_screen} />
      <Stack.Screen name="StepZonaScreen" component={step_zona_screen} />
      <Stack.Screen name="StepNameScreen" component={step_name_screen} />
      <Stack.Screen name="StepAgeScreen" component={step_age_screen} />
      <Stack.Screen name="StepHealthScreen" component={step_health_screen} />
      <Stack.Screen name="StepConfirmScreen" component={step_confirm_screen} />
      <Stack.Screen name="SuccessScreen" component={success_screen} />
      <Stack.Screen name="UserScreen" component={user_screen} />
      <Stack.Screen name="WalksScreen" component={walks_screen} />
      <Stack.Screen name="PaymentsScreen" component={payments_screen} />
      <Stack.Screen name="AvailableWalksScreen" component={available_walks_screen} />
      <Stack.Screen name="WalkHistoryScreen" component={walk_history_screen} />
      <Stack.Screen name="PetProfileScreen" component={pet_profile_screen} />
      <Stack.Screen name="RatingsScreen" component={ratings_screen} />
      <Stack.Screen name="WalkerProfileScreen" component={walker_profile_screen} />
      <Stack.Screen name="PlannerScreen" component={planner_screen} />
    </Stack.Navigator>
  );
}


