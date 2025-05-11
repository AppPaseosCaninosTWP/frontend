import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

interface SwipeButtonProps {
  on_toggle: (value: boolean) => void;
  text?: string;
  width?: number;
  height?: number;
  colors?: string[];
}

const SwipeButtonTWP = ({
  on_toggle,
  text = 'Desliza para continuar',
  width = 320,
  height = 60,
}: SwipeButtonProps) => {
  const padding = 6;
  const swipeable_size = height - 2 * padding;
  const swipe_range = width - 2 * padding - swipeable_size;
  const x_position = useSharedValue(0);
  const [toggled, set_toggled] = useState(false);

  const handle_complete = (is_toggled: boolean) => {
    if (is_toggled !== toggled) {
      set_toggled(is_toggled);
      on_toggle(is_toggled);
    }
  };

  const gesture_handler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.completed = toggled;
    },
    onActive: (event, ctx: any) => {
      let new_value = ctx.completed ? swipe_range + event.translationX : event.translationX;
      if (new_value >= 0 && new_value <= swipe_range) {
        x_position.value = new_value;
      }
    },
    onEnd: () => {
      if (x_position.value < width / 2 - swipeable_size / 2) {
        x_position.value = withSpring(0);
        runOnJS(handle_complete)(false);
      } else {
        x_position.value = withSpring(swipe_range);
        runOnJS(handle_complete)(true);
      }
    },
  });

  const animated_styles = {
    swipe_circle: useAnimatedStyle(() => ({
      transform: [{translateX: x_position.value}],
    })),
    swipe_text: useAnimatedStyle(() => ({
      opacity: interpolate(x_position.value, [0, swipe_range], [0.9, 0], Extrapolate.CLAMP),
      transform: [{
        translateX: interpolate(
          x_position.value,
          [0, swipe_range],
          [0, width / 2 - swipeable_size],
          Extrapolate.CLAMP,
        ),
      }],
    })),
  };

  return (
    <Animated.View style={[styles.container, {width, height, borderRadius: height / 2}]}>
      <PanGestureHandler onGestureEvent={gesture_handler}>
        <Animated.View style={[
          styles.swipe_circle,
          {
            width: swipeable_size,
            height: swipeable_size,
            borderRadius: swipeable_size / 2,
            left: padding,
          },
          animated_styles.swipe_circle
        ]}>
          <Text style={styles.arrow_icon}>{'»'}</Text>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.swipe_text, animated_styles.swipe_text]}>
  <Text style={styles.swipe_text_label}>
    {text}
  </Text>
</Animated.View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F0FF', // fondo suave
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  swipe_circle: {
    position: 'absolute',
    backgroundColor: '#0096FF',
    zIndex: 2, // antes estaba 3
    justifyContent: 'center',
    alignItems: 'center',
  },  
  arrow_icon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  swipe_text: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    left: 50,
  } as const,
  
  swipe_text_label: {
    fontSize: 16,
    color: '#0096FF',
    fontWeight: '600',
  } as const,
  
  
  
});

export default SwipeButtonTWP;


