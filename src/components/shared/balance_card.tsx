// src/components/BalanceCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface BalanceCardProps {
  balance: number | null;
  on_press: () => void;
}

export default function BalanceCard({ balance, on_press }: BalanceCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={on_press}
    >
      <LinearGradient
        colors={["#00AFFF", "#5ADFDE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <Feather
          name="credit-card"
          size={24}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <View style={styles.text_container}>
          <Text style={styles.label}>Saldo disponible</Text>
          <Text style={styles.amount}>
            {balance != null
              ? balance.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 2,
                })
              : "—"}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  text_container: {
    flex: 1,
  },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  amount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
});
