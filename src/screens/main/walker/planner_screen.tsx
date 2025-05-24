import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { get_token } from "../../../utils/token_service";
import SideMenu, { menu_option } from '../../../components/shared/side_menu';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;



interface AssignedWalk {
  walk_id:   number;
  pet_id:    number;
  pet_name:  string;
  pet_photo: string;
  zone:      string;
  date:      string;
  time:      string;
  duration:  number;
}

export default function PlannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [walks, setWalks]     = useState<AssignedWalk[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await get_token();
        if (!token) throw new Error("No auth token");
        const res = await fetch(`${API_BASE_URL}/walk/assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data, error, msg } = await res.json();
        if (error) throw new Error(msg);
        console.log("WALKS DATA:", data);
        setWalks(data);
      } catch (err: any) {
        Alert.alert("Error loading walks", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const menuOptions: menu_option[] = [
    {
      label: "Dashboard",
      icon: <Feather name="layout" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("DashboardPaseador"),
    },
    {
      label: "Search Walks",
      icon: <Feather name="search" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("AvailableWalksScreen"),
    },
    { label: "__separator__", icon: null, on_press: () => {} },
    {
      label: "Profile",
      icon: <Feather name="user" size={20} color="#000c14" />,
      on_press: () => navigation.navigate("WalkerProfileScreen"),
    },
  ];

  const renderItem = ({ item }: { item: AssignedWalk }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate("PetProfileScreen", {
          walkId:   item.walk_id,
          petId:    item.pet_id,
          duration: item.duration,
        })
      }
    >
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View style={styles.textContainer}>
          <Text style={styles.petName}>{item.pet_name}</Text>
          <Text style={styles.details}>
            {item.zone} · {item.date} · {item.time}
          </Text>
        </View>
        {item.pet_photo ? (
          <Image
            source={{ uri: `${API_BASE_URL}/uploads/${item.pet_photo}` }}
            style={styles.petImage}
          />
        ) : (
          <Feather
            name="user"
            size={80}
            color="#fff"
            style={{ marginLeft: 12 }}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
return (
       <View style={styles.wrapper}>
     <View style={styles.backHeader}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
         <Feather name="arrow-left" size={24} color="#333" />
       </TouchableOpacity>
       <Text style={styles.screenTitle}>Agenda</Text>
     </View>
      <Text style={styles.header}>
        Mis paseos:{' '}
        <Text style={styles.badge}>{walks.length}</Text>
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={walks}
          keyExtractor={w => w.walk_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
   </View>
  )
}
const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E6F4FF",
    color: "#007BFF",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  card: {
    borderRadius: 20,
    height: 120,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  petName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  details: {
    color: "#D0E7FF",
    fontSize: 14,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,  
    paddingBottom: 16,
  },
  screenTitle: {
    textAlign: "center",
    flex: 1,
    marginRight: 50,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});
