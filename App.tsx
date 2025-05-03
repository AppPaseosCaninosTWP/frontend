import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/stack_navigator';

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

