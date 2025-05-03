import { View, Text, StyleSheet } from 'react-native';

export default function RegisterScreen() {
    return (
        <View style={styles.register_container}>
        <Text style={styles.register_text}>Pantalla de Registro</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    register_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    register_text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});