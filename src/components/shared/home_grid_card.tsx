// src/components/HomeGridCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { ReactNode } from "react";

interface HomeGridCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  on_press: () => void;
}

export default function HomeGridCard({
  icon,
  title,
  description,
  on_press,
}: HomeGridCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={on_press}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.text}>{description}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#A8F5FD",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#111",
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});
