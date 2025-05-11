import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';
  import { useState } from 'react';
  
  export default function DashboardClienteScreen() {
    // Datos simulados: cambiar a [] para probar el estado vacío
    const [user_pets, set_user_pets] = useState([
      {
        name: 'Maxi',
        type: 'Perro',
        breed: 'Border Collie',
        avatar: require('../../assets/menu_dog.png'),
      },
    ]);
  
    const renderEmptyState = () => (
      <View style={styles.container}>
        <Text style={styles.greeting}>Hola, John</Text>
        <View style={styles.centered}>
          <Image
            //source={require('')}
            style={styles.empty_image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Uh Oh!</Text>
          <Text style={styles.subtitle}>
            Parece que no tienes perfiles configurados en este momento
          </Text>
          <TouchableOpacity style={styles.slide_button}>
            <Text style={styles.slide_text}>Desliza para continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const renderFullDashboard = () => (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hola, John</Text>
        <Text style={styles.section_title}>
          Perfiles de mascotas activos{' '}
          <Text style={styles.badge}>{user_pets.length}</Text>
        </Text>
  
        <View style={styles.pet_card}>
          <Text style={styles.pet_name}>{user_pets[0].name}</Text>
          <Text style={styles.pet_info}>
            {user_pets[0].type} | {user_pets[0].breed}
          </Text>
          <Image source={user_pets[0].avatar} style={styles.pet_avatar} />
        </View>
  
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.card_title}>¿Un Paseo?</Text>
            <Text style={styles.card_subtitle}>
              Agenda un paseo y deja que tu mascota lo disfrute.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.card_title}>Nutrición</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.card_title}>Tarjeta de Salud</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.card_title}>Historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  
    return user_pets.length === 0 ? renderEmptyState() : renderFullDashboard();
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingTop: 60,
      paddingHorizontal: 20,
      backgroundColor: '#fff',
    },
    greeting: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
    },
    section_title: {
      fontSize: 18,
      fontWeight: '500',
      marginBottom: 10,
    },
    badge: {
      backgroundColor: '#E6F4FF',
      color: '#007BFF',
      paddingHorizontal: 8,
      borderRadius: 12,
      fontSize: 14,
    },
    pet_card: {
      backgroundColor: '#007BFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      position: 'relative',
    },
    pet_name: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    },
    pet_info: {
      color: '#D0E7FF',
      marginBottom: 10,
    },
    pet_avatar: {
      position: 'absolute',
      right: 20,
      top: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    card: {
      width: '48%',
      backgroundColor: '#F9F9F9',
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
    },
    card_title: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 4,
    },
    card_subtitle: {
      fontSize: 12,
      color: '#6B7280',
    },
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
    },
    empty_image: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    slide_button: {
      backgroundColor: '#E0F2FF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 24,
    },
    slide_text: {
      color: '#007BFF',
      fontWeight: '600',
    },
  });
  