import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/welcome_screen';
import AuthIntroScreen from '../screens/auth_intro_screen';
import LoginScreen from '../screens/login_screen';
import RegisterScreen from '../screens/register_screen';
import ForgotPasswordScreen from '../screens/forgot_password_screen';
import VerifyCodeScreen from '../screens/verify_code_screen';
import ResetPasswordScreen from '../screens/reset_password_screen';
//import CreatePetProfileScreen from '../screens/create_pet_profile_screen';


export type RootStackParamList = {
  Welcome: undefined;
  AuthIntro: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string };
  ResetPassword: { email: string };
  //CreatePetProfile: { petToEdit?: PetProfile } | undefined;
}



//type PetProfile = {
//  id: string;
//  image: string;
//  name: string;
// breed?: string;
//  age: number;
//  sector: string;
//  description?: string;
//  comments?: string;
//  medical?: string;
//  sharedProfile: boolean;
//}


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
      {/*<Stack.Screen name="CreatePetProfile" component={CreatePetProfileScreen} />*/}
    </Stack.Navigator>
  );
}


