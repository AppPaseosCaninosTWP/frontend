// src/components/WalkCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { walk_model } from "../../models/walk_model";

interface WalkCardProps {
  walk: walk_model;
  card_width: number;
}

export default function WalkCard({ walk, card_width }: WalkCardProps) {
  // 1) Función para formatear "2025-05-23" → "23/05/25"
  const format_date = (date_str: string) => {
    const d = new Date(date_str);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // 2) Construir el string "HH:mm | DD/MM/YY"
  const date_part = walk.date ? format_date(walk.date) : "";
  const time_part = walk.time ?? "";
  const time_and_date =
    time_part && date_part
      ? `${time_part} | ${date_part}`
      : time_part || date_part;

  // 3) URI de la foto del pet (si viene solo el nombre de archivo)
  const image_uri = walk.pet_photo
    ? walk.pet_photo.startsWith("http")
      ? walk.pet_photo
      : `${process.env.EXPO_PUBLIC_API_URL}/uploads/${walk.pet_photo}`
    : null;

  return (
    <View style={{ width: card_width, marginRight: 16 }}>
      <LinearGradient
        colors={["#00AFFF", "#5ADFDE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View style={styles.text_container}>
          <Text style={styles.pet_name}>{walk.pet_name}</Text>
          {/* Aquí mostramos hora y fecha juntos */}
          <Text style={styles.detail}>{time_and_date}</Text>
        </View>
        {image_uri ? (
          <Image source={{ uri: image_uri }} style={styles.pet_image} />
        ) : (
          <Feather
            name="user"
            size={80}
            color="#fff"
            style={{ marginLeft: 12 }}
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 120,
  },
  text_container: {
    flex: 1,
  },
  pet_name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  detail: {
    color: "#D0E7FF",
    fontSize: 18,
  },
  pet_image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 12,
  },
});
