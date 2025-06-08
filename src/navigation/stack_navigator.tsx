
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { use_auth } from '../hooks/use_auth';
import { ActivityIndicator, View } from 'react-native';


// Auth Screens
import welcome_screen from "../screens/main/welcome_screen";
import auth_intro_screen from "../screens/auth/auth_intro_screen";
import login_screen from "../screens/auth/login_screen";
import register_screen from "../screens/auth/register_screen";
import forgot_password_screen from "../screens/auth/forgot_password_screen";
import verify_code_screen from "../screens/auth/verify_code_screen";
import reset_password_screen from "../screens/auth/reset_password_screen";

// Dashboard Screens
import dashboard_paseador_screen from "../screens/main/dashboard/dashboard_paseador_screen";
import dashboard_admin_screen from "../screens/main/dashboard/dashboard_admin_screen";
import dashboard_cliente_screen from "../screens/main/dashboard/dashboard_cliente_screen";
import dashboard_screen from "../screens/main/dashboard/dashboard_screen";

// Pet Creation
import step_breed_screen from "../screens/main/create_pet/step_breed_screen";
import step_zona_screen from "../screens/main/create_pet/step_zona_screen";
import step_name_screen from "../screens/main/create_pet/step_name_screen";
import step_age_screen from "../screens/main/create_pet/step_age_screen";
import step_health_screen from "../screens/main/create_pet/step_health_screen";
import step_confirm_screen from "../screens/main/create_pet/step_confirm_screen";
import success_screen from "../screens/main/create_pet/success_screen";

// Admin Screens
import user_screen from "../screens/main/Admin/user_screen";
import walks_screen from "../screens/main/Admin/walks_screen";
import payments_screen from "../screens/main/Admin/payments_screen";
import request_to_change_screen from "../screens/main/Admin/requestTochange_screen";
import register_walker_screen from "../screens/main/Admin/registerWalker_screen";

// Paseador Screens
import available_walks_screen from "../screens/main/walker/available_walks_screen";
import walk_history_screen from "../screens/main/walker/walk_history_screen";
import pet_profile_screen from "../screens/main/walker/pet_profile_screen";
import ratings_screen from "../screens/main/walker/ratings_screen";
import walker_profile_screen from "../screens/main/walker/walker_profile_screen";
import planner_screen from "../screens/main/walker/planner_screen";
import payments_walker_screen from "../screens/main/walker/payments_walker_screen";

// Cliente Screens
import pet_profile_cliente_screen from "../screens/main/client/pet_profile_cliente_screen";
import edit_pet_screen from "../screens/main/client/edit_pet_screen";
import create_walk_screen from "../screens/main/client/walks/create_walk_screen";
import select_walk_type_screen from "../screens/main/client/walks/select_walk_type_screen";
import walk_confirmation_screen from "../screens/main/client/walks/walk_confirmation_screen";
import walk_history_cliente_screen from "../screens/main/client/walks/walk_history_screen";

// Pagos Cliente
import payments_screen_cliente from "../screens/main/client/payment/payments_screen";
import payment_detail_screen_cliente from "../screens/main/client/payment/payment_detail_screen";
import payment_success_screen from "../screens/main/client/payment/payment_success_screen";

// Settings
import settings_screen from "../components/shared/settings_screen";

// Tipado
export type RootStackParamList = {
  welcome: undefined;
  auth_intro: undefined;
  login: undefined;
  register: undefined;
  forgot_password: undefined;
  verify_code: {
    email: string;
    phone?: string;
    context: 'reset' | 'register';
    token?: string;
  };
  reset_password: { email: string; code: string };

  dashboard_admin: undefined;
  dashboard_cliente: undefined;
  dashboard_paseador: undefined;
  dashboard_screen: undefined;

  step_breed_screen: undefined;
  step_zona_screen: undefined;
  step_name_screen: undefined;
  step_age_screen: undefined;
  step_health_screen: undefined;
  step_confirm_screen: undefined;
  success_screen: undefined;

  user_screen: undefined;
  walks_screen: undefined;
  payments_screen: undefined;
  request_to_change_screen: undefined;
  register_walker_screen: undefined;

  available_walks_screen: undefined;
  walk_history_screen: undefined;
  pet_profile_screen: {
    walkId: number;
    petId: number;
    duration: number;
  };
  ratings_screen: undefined;
  walker_profile_screen: undefined;
  planner_screen: undefined;
  payments_walker_screen: undefined;

  pet_profile_cliente_screen: { petId: number };
  edit_pet_screen: { petId: number };
  create_walk_screen: { type?: string };
  select_walk_type_screen: undefined;
  walk_confirmation_screen: undefined;
  walk_history_cliente_screen: undefined;

  payments_screen_cliente: undefined;
  payment_detail_screen_cliente: { paymentId: number };
  payment_success_screen: undefined;

  settings_screen: { role: 'admin' | 'walker' | 'cliente' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function stack_navigator() {
  const { is_authenticated, is_loading } = use_auth();

  if (is_loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={is_authenticated ? 'dashboard_screen' : 'welcome'} screenOptions={{ headerShown: false }}>
      {/* Público: sin sesión */}
      {!is_authenticated && (
        <>
          <Stack.Screen name="welcome" component={welcome_screen} />
          <Stack.Screen name="auth_intro" component={auth_intro_screen} />
          <Stack.Screen name="login" component={login_screen} />
          <Stack.Screen name="register" component={register_screen} />
          <Stack.Screen name="forgot_password" component={forgot_password_screen} />
          <Stack.Screen name="verify_code" component={verify_code_screen} />
          <Stack.Screen name="reset_password" component={reset_password_screen} />
        </>
      )}

      {/* Protegidas: con sesión */}
      {is_authenticated && (
        <>
          <Stack.Screen name="dashboard_admin" component={dashboard_admin_screen} />
          <Stack.Screen name="dashboard_cliente" component={dashboard_cliente_screen} />
          <Stack.Screen name="dashboard_paseador" component={dashboard_paseador_screen} />
          <Stack.Screen name="dashboard_screen" component={dashboard_screen} />

          {/* Pet Creation */}
          <Stack.Screen name="step_breed_screen" component={step_breed_screen} />
          <Stack.Screen name="step_zona_screen" component={step_zona_screen} />
          <Stack.Screen name="step_name_screen" component={step_name_screen} />
          <Stack.Screen name="step_age_screen" component={step_age_screen} />
          <Stack.Screen name="step_health_screen" component={step_health_screen} />
          <Stack.Screen name="step_confirm_screen" component={step_confirm_screen} />
          <Stack.Screen name="success_screen" component={success_screen} />

          {/* Admin */}
          <Stack.Screen name="user_screen" component={user_screen} />
          <Stack.Screen name="walks_screen" component={walks_screen} />
          <Stack.Screen name="payments_screen" component={payments_screen} />
          <Stack.Screen name="request_to_change_screen" component={request_to_change_screen} />
          <Stack.Screen name="register_walker_screen" component={register_walker_screen} />

          {/* Paseador */}
          <Stack.Screen name="available_walks_screen" component={available_walks_screen} />
          <Stack.Screen name="walk_history_screen" component={walk_history_screen} />
          <Stack.Screen name="pet_profile_screen" component={pet_profile_screen} />
          <Stack.Screen name="ratings_screen" component={ratings_screen} />
          <Stack.Screen name="walker_profile_screen" component={walker_profile_screen} />
          <Stack.Screen name="planner_screen" component={planner_screen} />
          <Stack.Screen name="payments_walker_screen" component={payments_walker_screen} />

          {/* Cliente */}
          <Stack.Screen name="pet_profile_cliente_screen" component={pet_profile_cliente_screen} />
          <Stack.Screen name="edit_pet_screen" component={edit_pet_screen} />
          <Stack.Screen name="create_walk_screen" component={create_walk_screen} />
          <Stack.Screen name="select_walk_type_screen" component={select_walk_type_screen} />
          <Stack.Screen name="walk_confirmation_screen" component={walk_confirmation_screen} />
          <Stack.Screen name="walk_history_cliente_screen" component={walk_history_cliente_screen} />

          {/* Pagos Cliente */}
          <Stack.Screen name="payments_screen_cliente" component={payments_screen_cliente} />
          <Stack.Screen name="payment_detail_screen_cliente" component={payment_detail_screen_cliente} />
          <Stack.Screen name="payment_success_screen" component={payment_success_screen} />

          {/* Ajustes */}
          <Stack.Screen name="settings_screen" component={settings_screen} options={{ headerShown: true, title: 'Ajustes' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
