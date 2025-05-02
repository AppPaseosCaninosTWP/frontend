import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.login_container}>
      <Text style={styles.login_text}>Pantalla de Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  login_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login_text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
