import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { get_token } from '../../../utils/token_service';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screen_width } = Dimensions.get('window');
const card_horizontal_padding = 20;
const card_width = screen_width - 2 * card_horizontal_padding;

const api_base_url = process.env.EXPO_PUBLIC_API_URL;

export default function WalkHistoryScreen() {
  const navigation = useNavigation();

  const [history, set_history] = useState<any[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        const token = await get_token();
        const res = await fetch(`${api_base_url}/walk/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        console.log('HISTORY DATA FROM API:', json.data);
        if (json.error) throw new Error(json.msg);
        set_history(json.data);
      } catch (e: any) {
        console.warn(e);
        set_history([]);
      } finally {
        set_loading(false);
      }
    })();
  }, []);

  const render_item = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card_wrapper}
      onPress={() => {}}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <MaterialCommunityIcons
          name="shoe-print"
          size={32}
          color="#fff"
          style={{ marginHorizontal: 12 }}
        />

        <View style={styles.text_container}>
          <Text style={styles.pet_name}>{item.pet_name}</Text>
          <Text style={styles.details}>
            {item.time} · {item.zone} · {item.date}
          </Text>
          <Text style={styles.duration}>
            Duración: {item.duration} min
          </Text>
        </View>

        {item.pet_photo ? (
          <Image
            source={{ uri: item.pet_photo }}
            style={styles.pet_image}
          />
        ) : (
          <Feather name="user" size={80} color="#fff" style={{ marginLeft: 12 }} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.back_header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screen_title}>Historial</Text>
      </View>

      <Text style={styles.header}>
        Paseos finalizados:{' '}
        <Text style={styles.badge}>{history.length}</Text>
      </Text>

      <FlatList
        data={history}
        keyExtractor={w => w.walk_id.toString()}
        renderItem={render_item}
        contentContainerStyle={styles.list_content}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 38,
    paddingHorizontal: card_horizontal_padding,
  },
  back_header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  screen_title: {
    textAlign: 'center',
    flex: 1,
    marginRight: 50,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  header: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#E6F4FF',
    color: '#007BFF',
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  list_content: {
    paddingBottom: 40,
  },
  card_wrapper: {
    width: card_width,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 20,
    height: 120,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_container: {
    flex: 1,
  },
  pet_name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  details: {
    color: '#D0E7FF',
    fontSize: 16,
  },
  duration: {
    color: '#D0E7FF',
    fontSize: 16,
    marginTop: 4,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
