//PAYMENTS WALKER SCREEN

//Importaciones y dependencias
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

//Servicios
import {
  get_walker_balance,
  get_payment_history,
} from "../../../service/payment_service";

//Modelos
import type {
  BalanceResponse,
  PaymentHistoryItem,
} from "../../../models/payment_model";
import type { RootStackParamList } from "../../../navigation/stack_navigator";

//Obtener el ancho de la pantalla para calcular el ancho de las tarjetas
const { width: screen_width } = Dimensions.get("window");
const h_padding = 20;
const card_width = screen_width - h_padding * 2;

export default function PaymentsWalkerScreen() {
  // Navegacion
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //Estado de carga, balance y historial de pagos
  const [loading, set_loading] = useState<boolean>(true);
  const [balance_info, set_balance_info] = useState<BalanceResponse | null>(
    null
  );
  const [payment_history, set_payment_history] = useState<PaymentHistoryItem[]>(
    []
  );

  //Al montar la pantalla, se llama a la función para obtener los datos
  useEffect(() => {
    fetch_data();
  }, []);

  // Llama al servicio para obtener el balance y el historial de pagos
  // Actualiza los estados correspondientes y maneja errores
  const fetch_data = async () => {
    set_loading(true);
    try {
      const bal = await get_walker_balance();
      set_balance_info(bal);

      const history = await get_payment_history();
      set_payment_history(history);
    } catch (err: any) {
      Alert.alert("Error", err.message);
      set_balance_info(null);
      set_payment_history([]);
    } finally {
      set_loading(false);
    }
  };
  // Si esta cargando, muestra un indicador de carga
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  //Una vez cargados los datos, formatea el balance para mostrarlo
  const formatted_balance = balance_info
    ? balance_info.balance.toLocaleString("es-CL", {
        style: "currency",
        currency: balance_info.currency ?? "CLP",
        minimumFractionDigits: 2,
      })
    : "";

  //Renderiza cada item del historial de pagos
  //Dependiendo del estado del pago, cambia el color del gradiente
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
          //Icono
          <Feather
            name="dollar-sign"
            size={28}
            color="#fff"
            style={{ marginHorizontal: 12 }}
          />
          //Detalles del pago
          <View style={styles.text_container}>
            <Text style={styles.amount}>{`CLP ${item.amount.toFixed(2)}`}</Text>
            <Text style={styles.details}>{item.date}</Text>
            <Text
              style={styles.details}
            >{`Cliente: ${item.client_email}`}</Text>
            <Text style={styles.status}>{`Estado: ${item.status}`}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      //Header con botón de retroceso y título
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi billetera</Text>
      </View>
      //Tarjeta de balance disponible
      <View style={styles.balance_card}>
        <Text style={styles.balance_label}>Saldo disponible</Text>
        <Text style={styles.balance_amount}>{formatted_balance}</Text>
      </View>
      //Título de historial de pagos
      <Text style={styles.section_title}>
        Historial de pagos ({payment_history.length})
      </Text>
      //Lista de historial de pagos
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

//Estilos de la pantalla
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
