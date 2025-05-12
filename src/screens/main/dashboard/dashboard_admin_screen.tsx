import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

export default function DashboardAdminScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Hola, CJ</Text>

      <View style={styles.card_container}>
        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/admin/admin_photo1.png')} style={styles.card_image} />
          <Text style={styles.card_title}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/admin/admin_photo2.png')} style={styles.card_image} />
          <Text style={styles.card_title}>Paseos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/admin/admin_photo3.png')} style={styles.card_image} />
          <Text style={styles.card_title}>Pagos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    marginLeft: 4,
  },
  card_container: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card_image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  card_title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
