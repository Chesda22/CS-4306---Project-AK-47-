import React, { memo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * NumberWheel — reusable scroll wheel with bigger, clearer numbers.
 * – Haptics enabled
 * – Optional slide / fade entrance animation
 */
export default memo(function NumberWheel({
  range,
  value,
  onChange,
  enterAnimation = 'fade',
  wheelHeight = 120, // total wheel height
  fontSize = 22,     // number font size
}) {
  // Convert range to WheelPickerExpo item objects
  const items = range.map(n => ({ label: String(n), value: n }));
  const selectedIndex = Math.max(range.indexOf(Number(value)), 0);

  // Choose entrance animation flavour
  const entering =
    enterAnimation === 'slide'
      ? SlideInUp.springify().damping(12)
      : FadeIn.duration(600);

  /**
   * Custom row renderer — keeps each row compact while enlarging text.
   * The wheel library sizes rows automatically; we just style the text.
   */
  const renderItem = ({ item }) => (
    <View style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
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
          height={wheelHeight}
          width={SCREEN_WIDTH * 0.8}
          backgroundColor="transparent"   /* allow card colour to show */
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
