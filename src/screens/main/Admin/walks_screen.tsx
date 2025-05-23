import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import HeaderAdmin from '../../../components/shared/header_admin';

interface Walker {
  name: string;
  avatar: any;
  rating: number;
}

interface Walk {
  id: string;
  owner_name: string;
  pet_name: string;
  date: string;
  status: 'Pendiente' | 'Aceptado' | 'En curso' | 'Finalizado' | 'Cancelado';
  zone: string;
  fee: string;
  start_time: string;
  end_time: string;
  type: string;
  walker: Walker;
  notes: string;
}

const mock_walks: Walk[] = [
  {
    id: '1',
    owner_name: 'Shaggy Rogers',
    pet_name: 'Maxi',
    date: '16.05.2025',
    status: 'Pendiente',
    zone: 'Antofagasta – Norte',
    fee: '$8.000 CLP',
    start_time: '11:00',
    end_time: '13:00',
    type: 'Fijo',
    walker: {
      name: 'CJ Johnson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.8,
    },
    notes: 'Preparando paseo.',
  },
  {
    id: '2',
    owner_name: 'Walter White',
    pet_name: 'Gus',
    date: '17.05.2025',
    status: 'Aceptado',
    zone: 'Antofagasta – Sur',
    fee: '$7.500 CLP',
    start_time: '09:00',
    end_time: '10:00',
    type: 'Prueba',
    walker: {
      name: 'Jesse Pinkman',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.5,
    },
    notes: 'Paseo aceptado.',
  },
  {
    id: '3',
    owner_name: 'Finn Mertens',
    pet_name: 'BMO',
    date: '15.05.2025',
    status: 'En curso',
    zone: 'Tierra de Ooo',
    fee: '$7.000 CLP',
    start_time: '08:00',
    end_time: '09:00',
    type: 'Esporádico',
    walker: {
      name: 'Rick Sanchez',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.2,
    },
    notes: 'Ruta en proceso.',
  },
  {
    id: '4',
    owner_name: 'Morty Smith',
    pet_name: 'Snuffles',
    date: '14.05.2025',
    status: 'Finalizado',
    zone: 'Tierra de Ooo',
    fee: '$6.500 CLP',
    start_time: '14:00',
    end_time: '15:00',
    type: 'Esporádico',
    walker: {
      name: 'Beth Smith',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.0,
    },
    notes: 'Paseo completado.',
  },
  {
    id: '5',
    owner_name: 'Rick Sanchez',
    pet_name: 'MortyBot',
    date: '11.05.2025',
    status: 'Cancelado',
    zone: 'Dimensión C-137',
    fee: '$0 CLP',
    start_time: '–',
    end_time: '–',
    type: 'Fijo',
    walker: {
      name: 'Birdperson',
      avatar: require('../../../assets/user_icon.png'),
      rating: 4.9,
    },
    notes: 'Cancelado por cliente.',
  },
];

type Filter =
  | 'Todos'
  | 'Pendiente'
  | 'Aceptado'
  | 'En curso'
  | 'Finalizado'
  | 'Cancelado';

const filter_options: Filter[] = [
  'Todos',
  'Pendiente',
  'Aceptado',
  'En curso',
  'Finalizado',
  'Cancelado',
];

function format_dd_mm_yyyy(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}


export default function Walks_screen() {
  const [query, set_query] = useState('');
  const [filter, set_filter] = useState<Filter>('Todos');
  const [show_filter, set_show_filter] = useState(false);
  const [selected_walk, set_selected_walk] = useState<Walk | null>(null);

  const today_key = format_dd_mm_yyyy(new Date());
  const yesterday_date = new Date();
  yesterday_date.setDate(yesterday_date.getDate() - 1);
  const yesterday_key = format_dd_mm_yyyy(yesterday_date);

  const sections = [
    { title: 'Hoy', data: mock_walks.filter(w => w.date === today_key) },
    { title: 'Ayer', data: mock_walks.filter(w => w.date === yesterday_key) },
    {
      title: 'Otros días',
      data: mock_walks.filter(w => w.date !== today_key && w.date !== yesterday_key),
    },
  ];

  const filtered_sections = sections
    .map(section => ({
      title: section.title,
      data: section.data.filter(w => {
        const matches_query = w.owner_name.toLowerCase().includes(query.toLowerCase());
        const matches_filter = filter === 'Todos' || w.status === filter;
        return matches_query && matches_filter;
      }),
    }))
    .filter(section => section.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <HeaderAdmin title="Paseos" />

      {/* Búsqueda y filtro */}
      <View style={styles.search_row}>
        <View style={styles.search_box}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.search_input}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={set_query}
          />
        </View>
        <TouchableOpacity
          style={styles.filter_btn}
          onPress={() => set_show_filter(v => !v)}
        >
          <Feather name="filter" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {show_filter && (
        <View style={styles.dropdown}>
          {filter_options.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.opt, filter === option && styles.opt_active]}
              onPress={() => {
                set_filter(option);
                set_show_filter(false);
              }}
            >
              <Text style={[styles.opt_text, filter === option && styles.opt_text_active]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lista seccionada */}
      <SectionList
        sections={filtered_sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.section_header}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => set_selected_walk(item)}
          >
            <View style={styles.card_row}>
              <Image source={item.walker.avatar} style={styles.avatar} />
              <View style={styles.card_info}>
                <Text style={styles.owner_name}>{item.owner_name}</Text>
                <Text style={styles.pet_name}>Mascota · {item.pet_name}</Text>
              </View>
              <View style={styles.status_pill}>
                <Text style={styles.status_text}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de detalle */}
      <Modal
        visible={!!selected_walk}
        transparent
        animationType="slide"
        onRequestClose={() => set_selected_walk(null)}
      >
        <View style={styles.modal_overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => set_selected_walk(null)} />
          {selected_walk && (
            <View style={styles.modal}>
              <View style={styles.handle} />
              <Text style={styles.modal_title}>{selected_walk.owner_name}</Text>
              <Text style={styles.modal_sub}>Mascota · {selected_walk.pet_name}</Text>

              <View style={styles.detail_row}>
                <Text style={styles.label}>Zona:</Text>
                <Text style={styles.value}>{selected_walk.zone}</Text>
              </View>
              <View style={styles.detail_row}>
                <Text style={styles.label}>Monto:</Text>
                <Text style={styles.value}>{selected_walk.fee}</Text>
              </View>
              <View style={styles.detail_row}>
                <Text style={styles.label}>Inicio:</Text>
                <Text style={styles.value}>{selected_walk.start_time}</Text>
              </View>
              <View style={styles.detail_row}>
                <Text style={styles.label}>Término:</Text>
                <Text style={styles.value}>{selected_walk.end_time}</Text>
              </View>
              <View style={styles.detail_row}>
                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.value}>{selected_walk.status}</Text>
              </View>
              <View style={styles.detail_row}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{selected_walk.type}</Text>
              </View>

              <Text style={styles.label}>Paseador:</Text>
              <View style={styles.walker_card}>
                <Image source={selected_walk.walker.avatar} style={styles.walker_avatar} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.walker_name}>{selected_walk.walker.name}</Text>
                  <Text style={styles.walker_rating}>{selected_walk.walker.rating.toFixed(1)} ⭐</Text>
                </View>
              </View>

              <Text style={styles.label}>Notas:</Text>
              <Text style={styles.value}>{selected_walk.notes}</Text>

              <TouchableOpacity style={styles.close_btn} onPress={() => set_selected_walk(null)}>
                <Text style={styles.close_txt}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  search_row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  search_box: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  search_input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filter_btn: {
    marginLeft: 12,
    backgroundColor: '#0096FF',
    padding: 12,
    borderRadius: 12,
  },
  dropdown: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 4,
    overflow: 'hidden',
  },
  opt: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  opt_active: {
    backgroundColor: '#0096FF',
  },
  opt_text: {
    fontSize: 14,
    color: '#333',
  },
  opt_text_active: {
    color: '#FFF',
    fontWeight: '600',
  },
  section_header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDD',
    marginRight: 12,
  },
  card_info: {
    flex: 1,
  },
  owner_name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  pet_name: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  status_pill: {
    backgroundColor: '#888',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  modal_overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginVertical: 12,
  },
  modal_title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modal_sub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detail_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#888',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  walker_card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  walker_avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  walker_name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  walker_rating: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  close_btn: {
    marginTop: 24,
    backgroundColor: '#0096FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  close_txt: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
