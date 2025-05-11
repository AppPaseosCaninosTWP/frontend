import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function DashboardAdminScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bienvenido, Administrador 👨‍💼</Text>

      <View style={styles.card_container}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Usuarios Registrados</Text>
          <Text style={styles.card_subtitle}>Ver y gestionar usuarios activos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Paseadores Verificados</Text>
          <Text style={styles.card_subtitle}>Lista de paseadores con validación</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Reportes</Text>
          <Text style={styles.card_subtitle}>Visualizar actividad y estadísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.card_title}>Solicitudes pendientes</Text>
          <Text style={styles.card_subtitle}>Validación y revisión manual</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card_container: {
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    backgroundColor: '#F0F4FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  card_title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  card_subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
