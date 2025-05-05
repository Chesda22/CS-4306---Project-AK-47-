import React, { memo } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Wheel with built‑in haptics and an entering animation.
 *
 * Props
 * ─────
 * • range ‑ number[]
 * • value ‑ string | number         (kept as string so your existing parseFloat still works)
 * • onChange ‑ (string) ⇒ void
 * • enterAnimation ‑ 'fade' | 'slide' (optional, default = 'fade')
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
}) {
  // Build WheelPicker items
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  // Dark / light background tint
  const scheme = useColorScheme();
  const bgColor = scheme === 'dark' ? '#1a1a1a' : '#f0f8ff';

  // Choose an Animated entering preset
  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  return (
    <Animated.View entering={entering}>
      <WheelPickerExpo
        haptics                              // ← subtle vibration 💥
        height={150}
        width={SCREEN_WIDTH - 40}
        backgroundColor={bgColor}
        items={items}
        initialSelectedIndex={selectedIndex}
        selectedStyle={{ borderColor: '#16c784', borderWidth: 2 }}
        onChange={({ item }) => onChange(String(item.label))}
      />
    </Animated.View>
  );
});
