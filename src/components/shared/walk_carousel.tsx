// src/components/WalkCarousel.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import WalkCard from "../shared/walk_card";
import type { walk_model } from "../../models/walk_model";

interface WalkCarouselProps {
  assigned_walks: walk_model[];
  container_width: number;
}

export default function WalkCarousel({
  assigned_walks,
  container_width,
}: WalkCarouselProps) {
  const [active_index, set_active_index] = useState(0);
  const card_width = container_width - 40;

  const on_scroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / card_width);
    set_active_index(idx);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={on_scroll}
        scrollEventThrottle={16}
      >
        {assigned_walks.map((walk, i) => (
          <WalkCard key={walk.walk_id} walk={walk} card_width={card_width} />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {assigned_walks.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, idx === active_index && styles.active_dot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  active_dot: {
    backgroundColor: "#007BFF",
  },
});
