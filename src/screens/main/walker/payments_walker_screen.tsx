import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { get_token, get_user } from "../../../utils/token_service";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/stack_navigator";
import { LinearGradient } from "expo-linear-gradient";

const { width: screen_width } = Dimensions.get("window");
const h_padding = 20;
const card_width = screen_width - h_padding * 2;
const api_base = process.env.EXPO_PUBLIC_API_URL;

//balance
interface balance_response {
  walker_id: number;
  walker_name: string;
  balance: number;
  currency: string;
}

//historial
interface payment_history_item {
  id: number;
  amount: number;
  date: string;
  status: string; // pendiente o completado
  client: string;
}

export default function PaymentsWalkerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, set_loading] = useState(true);
  const [balance_info, set_balance] = useState<balance_response | null>(null);
  const [payment_history, set_history] = useState<payment_history_item[]>([]);

  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        const token = await get_token();
        const user = await get_user();
        const walker_id = user?.id;

        // 1) balance
        let res = await fetch(
          `${api_base}/payment/walker/${walker_id}/balance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const text = await res.text();
          console.error("balance no JSON:", text);
          throw new Error(`Balance HTTP ${res.status}`);
        }
        const bal_json = await res.json();
        if (bal_json.error) throw new Error(bal_json.msg);
        set_balance(bal_json.data);

        // 2) historial
        res = await fetch(`${api_base}/payment/walkers/${walker_id}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("history no JSON:", text);
          throw new Error(`History HTTP ${res.status}`);
        }
        const hist_json = await res.json();
        if (hist_json.error) throw new Error(hist_json.msg);
        set_history(hist_json.data);
      } catch (err: any) {
        // error
        Alert.alert("Error", err.message);
      } finally {
        set_loading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  //balance a CLP, 2 decimales
  const formatted_balance = balance_info
    ? balance_info.balance.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 2,
      })
    : "";

  const render_history_item = ({ item }: { item: payment_history_item }) => {
    const colors: [string, string] =
      item.status === "completado"
        ? ["#00bdff", "#54edfe"]
        : ["#fa709a", "#fee100"];

    return (
      <TouchableOpacity style={styles.card_wrapper} activeOpacity={0.8}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <Feather
            name="dollar-sign"
            size={28}
            color="#fff"
            style={{ marginHorizontal: 12 }}
          />

          <View style={styles.text_container}>
            //metodo pago
            <Text style={styles.amount}>CLP {item.amount.toFixed(2)}</Text>
            //fecha
            <Text style={styles.details}>{item.date}</Text>
            //nombre cliente
            <Text style={styles.details}>Client: {item.client}</Text>
            //estado
            <Text style={styles.status}>Status: {item.status}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Payments</Text>
      </View>

      <View style={styles.balance_card}>
        <Text style={styles.balance_label}>Saldo disponible</Text>
        <Text style={styles.balance_amount}>{formatted_balance}</Text>
      </View>

      <Text style={styles.section_title}>
        Historial de pagos ({payment_history.length})
      </Text>

      <FlatList
        data={payment_history}
        keyExtractor={(i) => i.id.toString()}
        renderItem={render_history_item}
        contentContainerStyle={styles.list_content}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: h_padding,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 30,
    marginBottom: 30,
  },
  title: {
    flex: 1,
    textAlign: "center",
    marginRight: 30,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  balance_card: {
    backgroundColor: "#E6F4FF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balance_label: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  balance_amount: {
    fontSize: 32,
    color: "#007BFF",
    fontWeight: "700",
  },
  section_title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111",
  },
  list_content: {
    paddingBottom: 40,
  },
  card_wrapper: {
    width: card_width,
    alignSelf: "center",
  },
  card: {
    borderRadius: 20,
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  text_container: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#D0E7FF",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});
