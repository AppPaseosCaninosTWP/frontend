import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

interface Props {
  on_confirm: (location: { latitude: number; longitude: number }) => void;
}

export default function LocationPicker({ on_confirm }: Props) {
  const [region, set_region] = useState<Region | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const get_location = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No se pudo obtener la ubicación actual");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        set_region({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (err: any) {
        Alert.alert("Error", "No se pudo obtener la ubicación actual");
      } finally {
        set_loading(false);
      }
    };

    get_location();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 12 }}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={(r) => set_region(r)}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            on_confirm({ latitude: region.latitude, longitude: region.longitude })
          }
        >
          <Text style={styles.button_text}>Confirmar ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  button_text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
