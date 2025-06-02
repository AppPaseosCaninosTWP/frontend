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
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface BalanceResponse {
  walker_id: number;
  walker_name: string;
  balance: number;
  currency?: string;
}

interface PaymentHistoryItem {
  payment_id: number;
  amount: number;
  date: string;
  status: string; // pendiente o completado
  client_email: string;
}

export default function PaymentsWalkerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, set_loading] = useState<boolean>(true);

  const [balance_info, set_balance_info] = useState<BalanceResponse | null>(
    null
  );

  const [payment_history, set_payment_history] = useState<PaymentHistoryItem[]>(
    []
  );

  useEffect(() => {
    (async () => {
      set_loading(true);
      try {
        const token = await get_token();
        const user = await get_user();
        const walker_id = user?.id;

        if (!token || !walker_id) {
          throw new Error("Sesión no válida");
        }

        const res_balance = await fetch(
          `${API_BASE_URL}/walker_profile/get_profile/${walker_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res_balance.ok) {
          const text = await res_balance.text();
          console.error("Error al cargar balance:", text);
          throw new Error(`Balance HTTP ${res_balance.status}`);
        }
        const bal_json = await res_balance.json();
        if (bal_json.error) {
          throw new Error(bal_json.msg);
        }
        const walker_data = bal_json.data as any;
        set_balance_info({
          walker_id: walker_data.walker_id,
          walker_name: walker_data.name,
          balance: walker_data.balance,
          currency: "CLP",
        });

        const res_history = await fetch(`${API_BASE_URL}/payment/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res_history.ok) {
          const text = await res_history.text();
          console.error("Error al cargar historial:", text);
          throw new Error(`History HTTP ${res_history.status}`);
        }
        const hist_json = await res_history.json();
        if (hist_json.error) {
          throw new Error(hist_json.msg);
        }

        const raw_history: any[] = hist_json.data;
        const mapped_history: PaymentHistoryItem[] = raw_history.map((p) => ({
          payment_id: p.payment_id,
          amount: Number(p.amount),
          date: new Date(p.date).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          status: p.status,
          client_email: p.walk?.client?.email ?? "—",
        }));
        set_payment_history(mapped_history);
      } catch (err: any) {
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

  const formatted_balance = balance_info
    ? balance_info.balance.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 2,
      })
    : "";

  const render_history_item = ({ item }: { item: PaymentHistoryItem }) => {
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
            <Text style={styles.amount}>CLP {item.amount.toFixed(2)}</Text>
            <Text style={styles.details}>{item.date}</Text>
            <Text style={styles.details}>Cliente: {item.client_email}</Text>
            <Text style={styles.status}>Estado: {item.status}</Text>
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
        <Text style={styles.title}>Mi billetera</Text>
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
        keyExtractor={(i) => i.payment_id.toString()}
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
