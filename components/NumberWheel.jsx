import React, { memo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Customisable number wheel with haptics and entrance animation.
 * Uses `renderItem` to bump font‑size of each label.
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
  height = 120, // taller to match bigger font
  fontSize = 22, // 🆕 font size control
}) {
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  /** Render each picker row with a bigger, centered label */
  const renderItem = ({ item, index }) => (
    <View style={{ height: height, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize, fontWeight: '600', color: '#333' }}>{item.label}</Text>
    </View>
  );

  return (
    <Animated.View entering={entering} style={{ alignSelf: 'center' }}>
      <View
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          width: SCREEN_WIDTH * 0.8,
        }}
      >
        <WheelPickerExpo
          haptics
          height={height}
          width={SCREEN_WIDTH * 0.8}
          backgroundColor="#FFFFFF"
          items={items}
          initialSelectedIndex={selectedIndex}
          selectedStyle={{ borderColor: '#16c784', borderWidth: 2 }}
          onChange={({ item }) => onChange(String(item.label))}
          renderItem={renderItem}
        />
      </View>
    </Animated.View>
  );
});
