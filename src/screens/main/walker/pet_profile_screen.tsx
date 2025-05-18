import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/stack_navigator';

const TABS = ['Acerca de', 'Salud', 'Nutrición', 'Contacto'];

export default function PetProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('Acerca de');

  const renderTabButton = (label: string) => (
    <TouchableOpacity
      key={label}
      style={[styles.tabButton, activeTab === label && styles.tabActive]}
      onPress={() => setActiveTab(label)}
    >
      <Text style={[styles.tabText, activeTab === label && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil de mascota</Text>
      </View>

      <View style={styles.tabRow}>{TABS.map(renderTabButton)}</View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Acerca de' && (
          <>

            <View style={styles.profileContainer}>
              <Image
                source={require('../../../assets/breeds/golden.png')}
                style={styles.petImage}
              />
              <Text style={styles.petName}>Maxi</Text>
              <Text style={styles.petBreed}>Perro | Border Collie</Text>
            </View>

            <Text style={styles.sectionTitle}>Apariencia y signos distintivos</Text>
            <Text style={styles.description}>
              Mezcla de color marrón, blanco oscuro, con cejas claras y una mancha en forma de corazón en la pata izquierda.
            </Text>

            <View style={styles.infoTable}>
              <View style={styles.row}><Text style={styles.label}>Género</Text><Text style={styles.value}>Macho</Text></View>
              <View style={styles.row}><Text style={styles.label}>Tamaño</Text><Text style={styles.value}>Medio</Text></View>
              <View style={styles.row}><Text style={styles.label}>Peso</Text><Text style={styles.value}>22,2 kg</Text></View>
              <View style={styles.row}><Text style={styles.label}>Dueño</Text><Text style={styles.value}>Walter White</Text></View>
              <View style={styles.row}><Text style={styles.label}>Tipo de paseo</Text><Text style={styles.value}>Fijo</Text></View>
              <View style={styles.row}><Text style={styles.label}>Hora</Text><Text style={styles.value}>11:00</Text></View>
              <View style={styles.row}><Text style={styles.label}>Hora término</Text><Text style={styles.value}>13:00</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Datos importantes</Text>
            <View style={styles.card}><Text style={styles.cardIcon}>🎂</Text><Text style={styles.cardText}>3 Noviembre 2019</Text><Text style={styles.cardNote}>4 años</Text></View>
            <View style={styles.card}><Text style={styles.cardIcon}>📍</Text><Text style={styles.cardText}>Angamos 0610</Text></View>
            <View style={styles.card}><Text style={styles.cardIcon}>💊</Text><Text style={styles.cardText}>Saludable</Text></View>
            <View style={styles.card}><Text style={styles.cardIcon}>🧠</Text><Text style={styles.cardText}>Dócil, le gusta que lo acaricien ...</Text></View>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Aceptar</Text></TouchableOpacity>
          </>
          
        )}

        {activeTab === 'Salud' && (
          <>
            <View style={styles.infoCard}><Text style={styles.cardTitle}>💊 Medicamentos</Text></View>
            <Text style={styles.description}>
              Maxi debe tomar una pastilla de Apoquel de 5.4 mg todos los días a las 12:00 hrs, junto con su comida del mediodía. Es importante que la pastilla se administre con alimento para evitar molestias estomacales. La pastilla está en su bolsita, identificada con su nombre. Si no quiere comer, por favor avisarme y no forzarle el medicamento.
            </Text>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Aceptar</Text></TouchableOpacity>
          </>
        )}

        {activeTab === 'Nutrición' && (
          <>
            <View style={styles.infoCard}><Text style={styles.cardTitle}>🍱 Diario de alimentos</Text></View>
            <Text style={styles.description}>
              Maxi come snacks marca Pedigree (barras pequeñas). No dar más de 2 durante el paseo. Si lo notas jadeando mucho o con la lengua seca, ofrece agua. Lleva su botella en la mochila que te entregué.
            </Text>
            <Text style={styles.sectionTitle}>Comidas programadas</Text>
            <View style={styles.row}><Text style={styles.label}>Desayuno</Text><Switch value={true} /></View>
            <View style={styles.row}><Text style={styles.label}>Almuerzo</Text><Switch value={false} /></View>
            <View style={styles.row}><Text style={styles.label}>Cena</Text><Switch value={true} /></View>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Aceptar</Text></TouchableOpacity>
          </>
        )}

        {activeTab === 'Contacto' && (
          <>
          <View style={styles.infoCard}><Text style={styles.cardTitle}>📞 Contacto del dueño</Text></View>

    <View style={styles.contactCard}>
      <Image
        source={require('../../../assets/user_icon.png')}
        style={styles.contactAvatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.contactName}>Walter White</Text>
        <Text style={styles.contactInfo}>+56 9 1234 5678</Text>
        <Text style={styles.contactInfo}>walter.white@correo.com</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.contactButton}>
      <Text style={styles.contactButtonText}>Llamar</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#6C63FF' }]}>
      <Text style={styles.contactButtonText}>Enviar correo</Text>
    </TouchableOpacity>
  </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  petBreed: {
    color: '#888',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 6,
    color: '#111',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  infoTable: {
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    color: '#555',
    fontSize: 14,
  },
  value: {
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  cardNote: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  contactCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F3F4F6',
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
},
contactAvatar: {
  width: 56,
  height: 56,
  borderRadius: 28,
  marginRight: 12,
},
contactName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111',
},
contactInfo: {
  fontSize: 14,
  color: '#555',
},
contactButton: {
  marginTop: 16,
  backgroundColor: '#007BFF',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
},
contactButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 15,
},

});
