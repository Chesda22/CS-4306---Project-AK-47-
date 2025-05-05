import React, { memo } from 'react';
import { Dimensions, View, useColorScheme } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Lightweight number wheel that fits comfortably inside a white card.
 * Haptics enabled, supports fade/slide entrance animations.
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
  height = 100, // 🆕 default smaller
}) {
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  const scheme = useColorScheme();
  const bgColor = 'transparent'; // keep the card's white background visible

  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  return (
    <Animated.View entering={entering} style={{ alignSelf: 'center' }}>
      {/* Rounded wrapper to clip the wheel so it stays inside the card */}
      <View
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          width: SCREEN_WIDTH * 0.8, // leave some side padding
        }}
      >
        <WheelPickerExpo
          haptics
          height={height}
          width={SCREEN_WIDTH * 0.8}
          backgroundColor={bgColor}
          items={items}
          initialSelectedIndex={selectedIndex}
          selectedStyle={{ borderColor: '#16c784', borderWidth: 2 }}
          onChange={({ item }) => onChange(String(item.label))}
        />
      </View>
    </Animated.View>
  );
});
