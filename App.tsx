import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/stack_navigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PetCreationProvider } from './src/context/pet_creation_context';
import { AuthProvider } from './src/context/auth/auth_context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PetCreationProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </PetCreationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
