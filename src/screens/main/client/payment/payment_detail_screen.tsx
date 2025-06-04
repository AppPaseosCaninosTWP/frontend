import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  get_payment_by_id,
  update_payment_status,
} from "../../../../service/payment_service";
import type { RootStackParamList } from "../../../../navigation/stack_navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";

type PaymentDetailRoute = RouteProp<
  RootStackParamList,
  "PaymentDetailScreenCliente"
>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function PaymentDetailScreen() {
  const { params } = useRoute<PaymentDetailRoute>();
  const navigation = useNavigation<Navigation>();
  const { paymentId } = params;

  const [payment, set_payment] = useState<any>(null);
  const [loading, set_loading] = useState(true);
  const [processing, set_processing] = useState(false);

  useEffect(() => {
    const fetch_detail = async () => {
      try {
        const data = await get_payment_by_id(paymentId);
        set_payment(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "No se pudo cargar el pago");
      } finally {
        set_loading(false);
      }
    };
    fetch_detail();
  }, [paymentId]);

  const handle_pay = async () => {
    try {
      set_processing(true);
      await update_payment_status(paymentId, "pagado");
      navigation.replace("PaymentSuccessScreen");
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo actualizar el pago");
    } finally {
      set_processing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!payment) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el pago</Text>
      </View>
    );
  }

  const { status, amount, created_at, walk } = payment;

  const fecha_pago = dayjs(created_at).format("DD/MM/YYYY");

  const cliente =
    typeof walk?.client?.email === "string" && walk.client.email.trim() !== ""
      ? walk.client.email
      : "No disponible";

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_button}>
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Detalle del Pago</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{status}</Text>

        <Text style={styles.label}>Monto:</Text>
        <Text style={styles.value}>${amount.toLocaleString()}</Text>

        <Text style={styles.label}>Fecha de creación:</Text>
        <Text style={styles.value}>{fecha_pago}</Text>

        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{cliente}</Text>
      </View>

      {status === "pendiente" && (
        <TouchableOpacity
          onPress={handle_pay}
          style={styles.pay_button}
          disabled={processing}
        >
          <Text style={styles.pay_button_text}>
            {processing ? "Procesando..." : "Pagar ahora"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  back_button: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f4f8",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  placeholder: {
    fontSize: 16,
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 6,
  },
  pay_button: {
    marginTop: 24,
    backgroundColor: "#4caf50",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  pay_button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
