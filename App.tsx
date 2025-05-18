import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/stack_navigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PetCreationProvider } from './src/context/pet_creation_context'; // ✅ importa el contexto

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PetCreationProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PetCreationProvider>
    </GestureHandlerRootView>
  );
}