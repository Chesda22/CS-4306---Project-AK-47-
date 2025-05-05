import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * NumberWheel — simplified version using WheelPickerExpo's built‑in textStyle prop.
 * Enlarges numbers without a custom renderItem (avoids undefined error).
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
  wheelHeight = 120,
  fontSize = 24, // bigger font via textStyle
}) {
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  return (
    <Animated.View entering={entering} style={{ alignSelf: 'center' }}>
      <WheelPickerExpo
        haptics
        height={wheelHeight}
        width={SCREEN_WIDTH * 0.8}
        backgroundColor="transparent"
        items={items}
        initialSelectedIndex={selectedIndex}
        selectedStyle={{ borderColor: '#16c784', borderWidth: 2 }}
        onChange={({ item }) => onChange(String(item.label))}
        textStyle={{ fontSize, fontWeight: '600', color: '#333' }}
        selectedTextStyle={{ fontSize: fontSize + 2, fontWeight: '700', color: '#000' }}
      />
    </Animated.View>
  );
});
